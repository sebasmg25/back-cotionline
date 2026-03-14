import { GetBranchUseCase } from '../../../src/contexts/branch/useCases/getBranch.useCase';

describe('GetBranchUseCase', () => {
  let useCase: GetBranchUseCase;
  let mockBranchRepository: any;
  let mockBusinessRepository: any;

  beforeEach(() => {
    mockBranchRepository = {
      findById: jest.fn()
    };
    mockBusinessRepository = {
      findById: jest.fn()
    };
    useCase = new GetBranchUseCase(mockBranchRepository, mockBusinessRepository);
  });

  it('should throw an error if branch is not found', async () => {
    mockBranchRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('branch-1', 'user-1')).rejects.toThrow('Sede no encontrada.');
  });

  it('should throw an error if business is not found or not owned by the user', async () => {
    mockBranchRepository.findById.mockResolvedValue({ businessId: 'bus-1' });
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'other-user' });
    await expect(useCase.execute('branch-1', 'user-1')).rejects.toThrow('No tienes permiso para ver esta sede.');
  });

  it('should return branch properties if validations pass', async () => {
    const branchData = { id: 'branch-1', businessId: 'bus-1', name: 'Sede Principal' };
    mockBranchRepository.findById.mockResolvedValue(branchData);
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });

    const result = await useCase.execute('branch-1', 'user-1');

    expect(result.id).toBe('branch-1');
    expect(result.name).toBe('Sede Principal');
  });
});
