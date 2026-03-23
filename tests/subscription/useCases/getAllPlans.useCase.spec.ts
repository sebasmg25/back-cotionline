import { GetAllPlansUseCase } from '../../../src/contexts/subscription/useCases/getAllPlans.useCase';

describe('GetAllPlansUseCase', () => {
  let useCase: GetAllPlansUseCase;
  let mockPlanRepo: any;

  beforeEach(() => {
    mockPlanRepo = { findAll: jest.fn() };
    useCase = new GetAllPlansUseCase(mockPlanRepo);
  });

  it('should fetch, sort by price natively, and map as plain DTOs', async () => {
    mockPlanRepo.findAll.mockResolvedValue([
      { id: '2', name: 'PREMIUM', price: 50000, features: [], collaboratorLimit: 10, quoteLimit: 100, branchLimit: 5 },
      { id: '1', name: 'FREE', price: 0, features: [], collaboratorLimit: 2, quoteLimit: 10, branchLimit: 1 }
    ]);

    const result = await useCase.execute();

    expect(mockPlanRepo.findAll).toHaveBeenCalled();
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('FREE');
    expect(result[1].name).toBe('PREMIUM');
  });
});
