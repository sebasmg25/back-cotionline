import { GetAllQuotationsByUserIdUseCase } from '../../../src/contexts/quotation/useCases/getAllQuotationsByUserId.useCase';

describe('GetAllQuotationsByUserIdUseCase', () => {
  let useCase: GetAllQuotationsByUserIdUseCase;
  let mockQuotationRepo: any;
  let mockQuotationRequestRepo: any;

  beforeEach(() => {
    mockQuotationRepo = { findAllByUserId: jest.fn() };
    mockQuotationRequestRepo = { findById: jest.fn() };
    useCase = new GetAllQuotationsByUserIdUseCase(mockQuotationRepo, mockQuotationRequestRepo);
  });

  const session = { id: 'vendor-1', role: 'PROVIDER' };

  it('should fetch and correctly merge quotations with request titles', async () => {
    mockQuotationRepo.findAllByUserId.mockResolvedValue([
      { id: 'q1', quotationRequestId: 'req-1', issueDate: '2023-01-01' },
      { id: 'q2', quotationRequestId: 'req-2', issueDate: '2023-01-02' }
    ]);

    mockQuotationRequestRepo.findById.mockImplementation(async (id: string) => {
      if (id === 'req-1') return { title: 'Laptops Req' };
      if (id === 'req-2') return null; // Null should fallback to default title
    });

    const result = await useCase.execute(session);

    expect(mockQuotationRepo.findAllByUserId).toHaveBeenCalledWith('vendor-1');
    expect(result.length).toBe(2);
    expect(result[0].requestTitle).toBe('Laptops Req');
    expect(result[0].createdAt).toBe('2023-01-01');
    expect(result[1].requestTitle).toBe('Solicitud sin título');
  });
});
