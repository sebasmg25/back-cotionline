import { GetReceivedQuotationsByUserIdUseCase } from '../../../src/contexts/quotation/useCases/getReceivedQuotationsByUserId.useCase';

describe('GetReceivedQuotationsByUserIdUseCase', () => {
  let useCase: GetReceivedQuotationsByUserIdUseCase;
  let mockQuotationRepo: any;

  beforeEach(() => {
    mockQuotationRepo = { findReceivedByUserId: jest.fn() };
    useCase = new GetReceivedQuotationsByUserIdUseCase(mockQuotationRepo);
  });

  const session = { id: 'buyer-1', role: 'BUYER' };

  it('should fetch appropriately shaped received quotations', async () => {
    mockQuotationRepo.findReceivedByUserId.mockResolvedValue([
      { id: 'q1', requestTitle: 'Custom Request', issueDate: '2023-01-01' },
      { id: 'q2', issueDate: '2023-01-02' } // No title provided
    ]);

    const result = await useCase.execute(session);
    
    expect(mockQuotationRepo.findReceivedByUserId).toHaveBeenCalledWith('buyer-1');
    expect(result.length).toBe(2);
    expect(result[0].requestTitle).toBe('Custom Request');
    expect(result[1].requestTitle).toBe('Solicitud sin título');
    expect(result[0].createdAt).toBe('2023-01-01');
  });
});
