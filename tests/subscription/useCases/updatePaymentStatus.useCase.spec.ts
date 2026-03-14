import { UpdatePaymentStatusUseCase } from '../../../src/contexts/subscription/useCases/updatePaymentStatus.useCase';
import { PaymentStatus } from '../../../src/contexts/subscription/domain/models/paymentTransaction.model';

describe('UpdatePaymentStatusUseCase', () => {
  let useCase: UpdatePaymentStatusUseCase;
  let mockTxRepo: any, mockUserRepo: any;

  beforeEach(() => {
    mockTxRepo = { findById: jest.fn(), updateStatus: jest.fn() };
    mockUserRepo = { updatePlan: jest.fn() };
    useCase = new UpdatePaymentStatusUseCase(mockTxRepo, mockUserRepo);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const txRaw = { id: 'tx-1', userId: 'user-1', planId: 'plan-1', status: PaymentStatus.PENDING };

  it('should firmly throw error if transaction not found', async () => {
    mockTxRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('tx-0', 'APPROVED', 'wompi-0')).rejects.toThrow('Transacción con referencia tx-0 no encontrada.');
  });

  it('should ignore process securely if practically not in PENDING state anymore', async () => {
    mockTxRepo.findById.mockResolvedValue({ ...txRaw, status: PaymentStatus.APPROVED });
    await useCase.execute('tx-1', 'APPROVED', 'wompi-1');

    expect(mockTxRepo.updateStatus).not.toHaveBeenCalled();
    expect(mockUserRepo.updatePlan).not.toHaveBeenCalled();
  });

  it('should map APPROVED explicitly, pushing plan data directly to User repository', async () => {
    mockTxRepo.findById.mockResolvedValue(txRaw);
    mockTxRepo.updateStatus.mockResolvedValue(true);
    mockUserRepo.updatePlan.mockResolvedValue(true);

    await useCase.execute('tx-1', 'APPROVED', 'wompi-id');

    expect(mockTxRepo.updateStatus).toHaveBeenCalledWith('tx-1', PaymentStatus.APPROVED, 'wompi-id');
    expect(mockUserRepo.updatePlan).toHaveBeenCalledWith('user-1', 'plan-1');
  });

  it('should safely degrade to ERROR and skip granting privileges when failed/canceled logically', async () => {
    mockTxRepo.findById.mockResolvedValue(txRaw);

    await useCase.execute('tx-1', 'FAILED');

    expect(mockTxRepo.updateStatus).toHaveBeenCalledWith('tx-1', PaymentStatus.ERROR);
    expect(mockUserRepo.updatePlan).not.toHaveBeenCalled(); // Safe default
  });

  it('should gracefully degrade to DECLINED status via wompi webhook event map', async () => {
    mockTxRepo.findById.mockResolvedValue(txRaw);

    await useCase.execute('tx-1', 'DECLINED');

    expect(mockTxRepo.updateStatus).toHaveBeenCalledWith('tx-1', PaymentStatus.DECLINED);
  });
});
