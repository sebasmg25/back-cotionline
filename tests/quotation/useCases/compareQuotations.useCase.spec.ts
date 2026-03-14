import { CompareQuotationsUseCase } from '../../../src/contexts/quotation/useCases/compareQuotations.useCase';

describe('CompareQuotationsUseCase', () => {
  let useCase: CompareQuotationsUseCase;
  let mockQuotationRepo: any;
  let mockQuotationRequestRepo: any;

  beforeEach(() => {
    mockQuotationRepo = { findByQuotationRequestId: jest.fn() };
    mockQuotationRequestRepo = { findById: jest.fn() };
    useCase = new CompareQuotationsUseCase(mockQuotationRepo, mockQuotationRequestRepo);
  });

  const session = { id: 'buyer-1', role: 'BUYER' };

  it('should throw if request does not exist or user lacks permission', async () => {
    mockQuotationRequestRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('req-1', session)).rejects.toThrow('No tienes permiso para comparar estas cotizaciones.');
  });

  it('should throw if there are no quotations linked', async () => {
    mockQuotationRequestRepo.findById.mockResolvedValue({ userId: 'buyer-1' });
    mockQuotationRepo.findByQuotationRequestId.mockResolvedValue([]);
    await expect(useCase.execute('req-1', session)).rejects.toThrow('No hay cotizaciones para esta solicitud');
  });

  it('should map and return the cheaper and faster quotations correctly', async () => {
    mockQuotationRequestRepo.findById.mockResolvedValue({ userId: 'buyer-1' });
    const fastQ = { id: 'fast', price: 1000, deliveryTime: 2 };
    const cheapQ = { id: 'cheap', price: 500, deliveryTime: 10 };
    const avgQ = { id: 'avg', price: 750, deliveryTime: 5 };

    mockQuotationRepo.findByQuotationRequestId.mockResolvedValue([fastQ, cheapQ, avgQ]);

    const result = await useCase.execute('req-1', session);

    expect(result.cheaper.id).toBe('cheap');
    expect(result.faster.id).toBe('fast');
  });
});
