import { UpdateBranchUseCase } from '../../../src/contexts/branch/useCases/updateBranch.useCase';

// Mock the whole geographical dataset for isolated testing
jest.mock('../../../src/contexts/shared/domain/constants/cities.data', () => ({
  COLOMBIAN_DATA: {
    'Antioquia': ['Medellín', 'Envigado'],
    'Cundinamarca': ['Bogotá, D.C.', 'Soacha']
  }
}));

describe('UpdateBranchUseCase', () => {
  let useCase: UpdateBranchUseCase;
  let mockBranchRepository: any;
  let mockBusinessRepository: any;

  beforeEach(() => {
    mockBranchRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    mockBusinessRepository = {
      findById: jest.fn()
    };
    useCase = new UpdateBranchUseCase(mockBranchRepository, mockBusinessRepository);
  });

  const existingBranch = { id: 'branch-1', businessId: 'bus-1', name: 'Old Branch', city: 'Envigado' };

  it('should throw an error if branch does not exist', async () => {
    mockBranchRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('branch-1', {}, 'user-1')).rejects.toThrow('La sede que intentas actualizar no existe');
  });

  it('should throw an error if user does not own the business of the branch', async () => {
    mockBranchRepository.findById.mockResolvedValue(existingBranch);
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'hacker-user' });
    await expect(useCase.execute('branch-1', {}, 'user-1')).rejects.toThrow('No tienes permiso para modificar esta sede.');
  });

  it('should throw an error if city change is geographically invalid', async () => {
    mockBranchRepository.findById.mockResolvedValue(existingBranch);
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });

    // City isn't in our mocked COLOMBIAN_DATA map
    await expect(useCase.execute('branch-1', { city: 'Atlantis' }, 'user-1')).rejects.toThrow('La ciudad proporcionada no es válida en nuestro registro oficial.');
  });

  it('should return the existing branch if no real changes are passed', async () => {
    mockBranchRepository.findById.mockResolvedValue(existingBranch);
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });

    // Try changing city to the exact same one it already has
    const result = await useCase.execute('branch-1', { city: 'Envigado' }, 'user-1');
    expect(mockBranchRepository.update).not.toHaveBeenCalled();
    expect(result.city).toBe('Envigado');
  });

  it('should successfully update and return branch when data is valid', async () => {
    mockBranchRepository.findById.mockResolvedValue(existingBranch);
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });
    
    const updatedModel = { ...existingBranch, name: 'New HQ Name', city: 'Medellín' };
    mockBranchRepository.update.mockResolvedValue(updatedModel);

    const result = await useCase.execute('branch-1', { name: 'New HQ Name', city: 'Medellín' }, 'user-1');

    expect(mockBranchRepository.update).toHaveBeenCalledWith('branch-1', {
      name: 'New HQ Name',
      city: 'Medellín'
    });
    expect(result.name).toBe('New HQ Name');
    expect(result.city).toBe('Medellín');
  });

  it('should throw an error if the save update in repository fails', async () => {
    mockBranchRepository.findById.mockResolvedValue(existingBranch);
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockBranchRepository.update.mockResolvedValue(null);

    await expect(useCase.execute('branch-1', { name: 'Valid New Name' }, 'user-1')).rejects.toThrow('Error al actualizar');
  });
});
