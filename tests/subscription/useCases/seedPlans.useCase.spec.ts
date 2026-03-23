import { SeedPlansUseCase } from '../../../src/contexts/subscription/useCases/seedPlans.useCase';

describe('SeedPlansUseCase', () => {
  let useCase: SeedPlansUseCase;
  let mockPlanRepo: any;

  beforeEach(() => {
    mockPlanRepo = { findAll: jest.fn(), save: jest.fn() };
    useCase = new SeedPlansUseCase(mockPlanRepo);
  });

  it('should escape instantly if plans already exist', async () => {
    mockPlanRepo.findAll.mockResolvedValue([{ id: 'plan-existing' }]);
    await useCase.execute();
    expect(mockPlanRepo.save).not.toHaveBeenCalled();
  });

  it('should cleanly insert the 3 default fallback plans if missing', async () => {
    mockPlanRepo.findAll.mockResolvedValue([]);
    await useCase.execute();
    expect(mockPlanRepo.save).toHaveBeenCalledTimes(3);
  });
});
