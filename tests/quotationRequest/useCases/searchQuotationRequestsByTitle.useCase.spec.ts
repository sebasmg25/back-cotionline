import { SearchQuotationRequestsByTitleUseCase } from '../../../src/contexts/quotationRequest/useCases/searchQuotationRequestsByTitle.useCase';

describe('SearchQuotationRequestsByTitleUseCase', () => {
  let useCase: SearchQuotationRequestsByTitleUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { updateExpiredStatus: jest.fn(), findByTitle: jest.fn() };
    useCase = new SearchQuotationRequestsByTitleUseCase(mockRepo);
  });

  it('should safely return empty array for empty title', async () => {
    const result = await useCase.execute('   ', { id: 'buyer-1', role: 'BUYER' });
    expect(result).toEqual([]);
    expect(mockRepo.updateExpiredStatus).not.toHaveBeenCalled();
  });

  it('should sync explicitly the owner and return correctly mapped requests', async () => {
    mockRepo.findByTitle.mockResolvedValue([
      { id: 'req-1', title: 'Laptops Need' }
    ]);
    mockRepo.updateExpiredStatus.mockResolvedValue();

    const result = await useCase.execute('Laptops', { id: 'buyer-1', ownerId: 'boss-1', role: 'COLLAB' } as any);

    expect(mockRepo.updateExpiredStatus).toHaveBeenCalledWith({ userId: 'boss-1' });
    expect(mockRepo.findByTitle).toHaveBeenCalledWith('Laptops', 'boss-1');
    expect(result[0].id).toBe('req-1');
  });
});
