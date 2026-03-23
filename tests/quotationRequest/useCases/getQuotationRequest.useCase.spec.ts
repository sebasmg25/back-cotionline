import { GetQuotationRequestUseCase } from '../../../src/contexts/quotationRequest/useCases/getQuotationRequest.useCase';
import { QuotationRequestStatus } from '../../../src/contexts/quotationRequest/domain/models/quotationRequest.model';

describe('GetQuotationRequestUseCase', () => {
  let useCase: GetQuotationRequestUseCase;
  let mockReqRepo: any, mockQuotRepo: any, mockBranchRepo: any, mockBusRepo: any, mockUserRepo: any;

  beforeEach(() => {
    mockReqRepo = { updateExpiredStatus: jest.fn(), findById: jest.fn() };
    mockQuotRepo = { findByUserAndQuotationRequest: jest.fn() };
    mockBranchRepo = { findById: jest.fn() };
    mockBusRepo = { findByUserId: jest.fn() };
    mockUserRepo = { findById: jest.fn() };

    useCase = new GetQuotationRequestUseCase(mockReqRepo, mockQuotRepo, mockBranchRepo, mockBusRepo, mockUserRepo);
  });

  const session = { id: 'user-1', role: 'BUYER' };

  it('should throw if request does not exist', async () => {
    mockReqRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('req-1', session)).rejects.toThrow('Solicitud de Cotización no encontrada.');
  });

  it('should permit viewing by the genuine owner', async () => {
    mockReqRepo.findById.mockResolvedValue({ id: 'req-1', userId: 'user-1', status: QuotationRequestStatus.EXPIRED });
    
    // Default mock behavior for branch mapping fallback
    const result = await useCase.execute('req-1', session);
    expect(result.id).toBe('req-1');
  });

  it('should permit viewing if the request is openly PUBLIC', async () => {
    mockReqRepo.findById.mockResolvedValue({ id: 'req-1', userId: 'other', status: QuotationRequestStatus.PENDING });
    
    const result = await useCase.execute('req-1', session);
    expect(result.id).toBe('req-1');
  });

  it('should permit viewing if the user has ALREADY SUBMITTED a quotation for it despite not being owner/public', async () => {
    mockReqRepo.findById.mockResolvedValue({ id: 'req-1', userId: 'other', status: QuotationRequestStatus.EXPIRED });
    mockQuotRepo.findByUserAndQuotationRequest.mockResolvedValue({ id: 'quot-1' });

    const result = await useCase.execute('req-1', session);
    expect(result.id).toBe('req-1');
  });

  it('should restrict viewing if not owner, not public, and has not provided quotation', async () => {
    mockReqRepo.findById.mockResolvedValue({ id: 'req-1', userId: 'other', status: QuotationRequestStatus.EXPIRED });
    mockQuotRepo.findByUserAndQuotationRequest.mockResolvedValue(null);

    await expect(useCase.execute('req-1', session)).rejects.toThrow('No tienes permiso para ver esta solicitud.');
  });
});
