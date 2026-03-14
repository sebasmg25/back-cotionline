import { GetQuotationsByRequestUseCase } from '../../../src/contexts/quotation/useCases/getQuotationsByRequest.useCase';

describe('GetQuotationsByRequestUseCase', () => {
  let useCase: GetQuotationsByRequestUseCase;
  let mockQuotationRepo: any;
  let mockQuotationRequestRepo: any;

  beforeEach(() => {
    mockQuotationRepo = { findByQuotationRequestId: jest.fn() };
    mockQuotationRequestRepo = { findById: jest.fn() };
    useCase = new GetQuotationsByRequestUseCase(mockQuotationRepo, mockQuotationRequestRepo);
  });

  const session = { id: 'buyer-1', role: 'BUYER' };

  it('should throw if request does not exist or user lacks permission', async () => {
    mockQuotationRequestRepo.findById.mockResolvedValue({ userId: 'hacker-buyer' });
    await expect(useCase.execute('req-1', session)).rejects.toThrow('No tienes permiso para ver las cotizaciones de esta solicitud.');
  });

  it('should return safely mapped configurations', async () => {
    mockQuotationRequestRepo.findById.mockResolvedValue({ userId: 'buyer-1' });
    mockQuotationRepo.findByQuotationRequestId.mockResolvedValue([
      { id: 'q1', price: 100 },
      { id: 'q2', price: 200 }
    ]);

    const result = await useCase.execute('req-1', session);
    
    expect(mockQuotationRepo.findByQuotationRequestId).toHaveBeenCalledWith('req-1');
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('q1');
    expect(result[1].price).toBe(200);
  });
});
