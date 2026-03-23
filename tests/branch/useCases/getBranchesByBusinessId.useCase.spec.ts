import { GetBranchesByBusinessIdUseCase } from '../../../src/contexts/branch/useCases/getBranchesByBusinessId.useCase';

describe('GetBranchesByBusinessIdUseCase', () => {
  let useCase: GetBranchesByBusinessIdUseCase;
  let mockBranchRepository: any;
  let mockBusinessRepository: any;

  beforeEach(() => {
    mockBranchRepository = {
      findBranchesByBusinessId: jest.fn()
    };
    mockBusinessRepository = {
      findById: jest.fn()
    };
    useCase = new GetBranchesByBusinessIdUseCase(mockBranchRepository, mockBusinessRepository);
  });

  const validSession = { id: 'owner-id', role: 'OWNER' };
  const collabSession = { id: 'collab-id', role: 'COLLABORATOR', ownerId: 'boss-id' };

  it('should throw an error if business is not found', async () => {
    mockBusinessRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bus-1', validSession)).rejects.toThrow('El negocio especificado no existe.');
  });

  it('should throw an error if business is not owned by the effective session user', async () => {
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'hackerman' });
    await expect(useCase.execute('bus-1', validSession)).rejects.toThrow('No tienes permiso para ver las sedes de este negocio.');
  });

  it('should return branch list mapped as DTOs for an owner', async () => {
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'owner-id' });
    mockBranchRepository.findBranchesByBusinessId.mockResolvedValue([
      { id: 'b1', name: 'Branch 1', businessId: 'bus-1' },
      { id: 'b2', name: 'Branch 2', businessId: 'bus-1' }
    ]);

    const result = await useCase.execute('bus-1', validSession);

    expect(result.length).toBe(2);
    expect(result[0].id).toBe('b1');
    expect(result[1].id).toBe('b2');
  });

  it('should return branch list for a collaborator using effective owner ID', async () => {
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'boss-id' });
    mockBranchRepository.findBranchesByBusinessId.mockResolvedValue([]);

    const result = await useCase.execute('bus-1', collabSession);

    expect(mockBusinessRepository.findById).toHaveBeenCalledWith('bus-1');
    expect(mockBranchRepository.findBranchesByBusinessId).toHaveBeenCalledWith('bus-1');
    expect(result.length).toBe(0);
  });
});
