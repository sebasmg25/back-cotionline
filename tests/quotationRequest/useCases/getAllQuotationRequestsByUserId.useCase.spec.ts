import { GetAllQuotationRequestsByUserIdUseCase } from '../../../src/contexts/quotationRequest/useCases/getAllQuotationRequestsByUserId.useCase';

describe('GetAllQuotationRequestsByUserIdUseCase', () => {
  let useCase: GetAllQuotationRequestsByUserIdUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { updateExpiredStatus: jest.fn(), findQuotationRequestsByUserId: jest.fn() };
    useCase = new GetAllQuotationRequestsByUserIdUseCase(mockRepo);
  });

  it('should correctly trigger synchronization and map data with internal products', async () => {
    mockRepo.updateExpiredStatus.mockResolvedValue();
    mockRepo.findQuotationRequestsByUserId.mockResolvedValue([
      { id: 'req-1', title: 'Title1', products: [{ id: 'prod-1', name: 'Thing' }] }
    ]);

    const result = await useCase.execute({ id: 'buyer-1', role: 'BUYER' });
    
    expect(mockRepo.updateExpiredStatus).toHaveBeenCalledWith({ userId: 'buyer-1' });
    expect(mockRepo.findQuotationRequestsByUserId).toHaveBeenCalledWith('buyer-1');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Title1');
    expect(result[0].products![0].name).toBe('Thing');
  });
});
