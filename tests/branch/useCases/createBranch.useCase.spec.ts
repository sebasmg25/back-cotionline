import { CreateBranchUseCase } from '../../../src/contexts/branch/useCases/createBranch.useCase';
import { Branch } from '../../../src/contexts/branch/domain/models/branch.model';

describe('CreateBranchUseCase', () => {
  let useCase: CreateBranchUseCase;
  let mockBranchRepository: any;
  let mockBusinessRepository: any;

  beforeEach(() => {
    mockBranchRepository = {
      findByName: jest.fn(),
      save: jest.fn()
    };
    mockBusinessRepository = {
      findById: jest.fn()
    };
    useCase = new CreateBranchUseCase(mockBranchRepository, mockBusinessRepository);
  });

  const validData = { name: 'Main HQ', address: '123 St', city: 'Medellín', businessId: 'bus-1' };

  it('should throw an error if the business does not exist', async () => {
    mockBusinessRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(validData, 'user-1')).rejects.toThrow('El negocio especificado no existe.');
  });

  it('should throw an error if the user does not own the business', async () => {
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'other-user' });
    await expect(useCase.execute(validData, 'user-1')).rejects.toThrow('No tienes permiso para agregar sedes a este negocio.');
  });

  it('should throw an error if the branch name already exists', async () => {
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockBranchRepository.findByName.mockResolvedValue({ id: 'existing-branch' });
    await expect(useCase.execute(validData, 'user-1')).rejects.toThrow('Ya existe una sede con este nombre.');
  });

  it('should successfully save and return a new branch', async () => {
    mockBusinessRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockBranchRepository.findByName.mockResolvedValue(null);

    const savedBranch = new Branch(validData.name, validData.address, validData.city, validData.businessId);
    Object.assign(savedBranch, { id: 'new-branch-id' });
    mockBranchRepository.save.mockResolvedValue(savedBranch);

    const result = await useCase.execute(validData, 'user-1');

    expect(mockBranchRepository.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('new-branch-id');
    expect(result.name).toBe('Main HQ');
  });
});
