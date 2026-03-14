import { InitializePaymentUseCase } from '../../../src/contexts/subscription/useCases/initializePayment.useCase';

jest.mock('../../../src/contexts/shared/infraestructure/payment/wompiSignature.service', () => ({
  WompiSignatureService: {
    generateIntegritySignature: jest.fn().mockReturnValue('mock-signature')
  }
}));

jest.mock('../../../src/contexts/shared/infraestructure/env/envConfig', () => ({
  EnvConfig: {
    get: jest.fn((key: string) => {
      if (key === 'WOMPI_INTEGRITY_SECRET') return 'integrity-secret';
      if (key === 'WOMPI_PUBLIC_KEY') return 'public-key';
      return 'val';
    })
  }
}));

describe('InitializePaymentUseCase', () => {
  let useCase: InitializePaymentUseCase;
  let mockPlanRepo: any;
  let mockTxRepo: any;

  beforeEach(() => {
    mockPlanRepo = { findById: jest.fn() };
    mockTxRepo = { save: jest.fn() };
    useCase = new InitializePaymentUseCase(mockPlanRepo, mockTxRepo);
  });

  it('should throw error if plan missing', async () => {
    mockPlanRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('user-1', 'plan-x')).rejects.toThrow('El plan seleccionado no existe.');
  });

  it('should securely map initialization, generate uuid, save transaction, and pack returning data', async () => {
    mockPlanRepo.findById.mockResolvedValue({ id: 'plan-xyz', price: 10000 });

    const result = await useCase.execute('user-1', 'plan-xyz');

    expect(mockTxRepo.save).toHaveBeenCalled();
    expect(result.amountInCents).toBe(1000000); // 10000 * 100
    expect(result.currency).toBe('COP');
    expect(result.signature).toBe('mock-signature');
    expect(result.publicKey).toBe('public-key');
    expect(result.reference).toBeDefined();
  });
});
