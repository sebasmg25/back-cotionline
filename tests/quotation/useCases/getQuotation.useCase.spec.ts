import { GetQuotationUseCase } from '../../../src/contexts/quotation/useCases/getQuotation.useCase';

describe('GetQuotationUseCase', () => {
  let useCase: GetQuotationUseCase;
  let mockQuotationRepo: any;
  let mockQuotationRequestRepo: any;

  beforeEach(() => {
    mockQuotationRepo = { findById: jest.fn() };
    mockQuotationRequestRepo = { findById: jest.fn() };
    useCase = new GetQuotationUseCase(mockQuotationRepo, mockQuotationRequestRepo);
  });

  it('should throw error if quotation not found', async () => {
    mockQuotationRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('quot-1', { id: 'vendor', role: 'PROVIDER' })).rejects.toThrow('Cotización no encontrada.');
  });

  it('should throw error if user is neither provider nor buyer', async () => {
    mockQuotationRepo.findById.mockResolvedValue({ userId: 'vendor-1', quotationRequestId: 'req-1' });
    mockQuotationRequestRepo.findById.mockResolvedValue({ userId: 'buyer-1' });

    await expect(useCase.execute('quot-1', { id: 'hacker-1', role: 'USER' })).rejects.toThrow('No tienes permiso para ver esta cotización.');
  });

  it('should return quotation for the provider', async () => {
    const quotation = { id: 'quot-1', userId: 'vendor-1', quotationRequestId: 'req-1' };
    mockQuotationRepo.findById.mockResolvedValue(quotation);
    mockQuotationRequestRepo.findById.mockResolvedValue({ userId: 'buyer-1' });

    const result = await useCase.execute('quot-1', { id: 'vendor-1', role: 'PROVIDER' });
    expect(result.id).toBe('quot-1');
  });

  it('should return quotation for the buyer', async () => {
    const quotation = { id: 'quot-1', userId: 'vendor-1', quotationRequestId: 'req-1' };
    mockQuotationRepo.findById.mockResolvedValue(quotation);
    mockQuotationRequestRepo.findById.mockResolvedValue({ userId: 'buyer-1' });

    const result = await useCase.execute('quot-1', { id: 'buyer-1', role: 'BUYER' });
    expect(result.id).toBe('quot-1');
  });
});
