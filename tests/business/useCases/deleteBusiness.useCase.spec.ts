import { DeleteBusinessUseCase } from '../../../src/contexts/business/useCases/deleteBusiness.useCase';

describe('DeleteBusinessUseCase', () => {
  let useCase: DeleteBusinessUseCase;
  let mockBusinessRepository: any;

  beforeEach(() => {
    mockBusinessRepository = {
      findById: jest.fn(),
      delete: jest.fn()
    };
    useCase = new DeleteBusinessUseCase(mockBusinessRepository);
  });

  const existingBusiness = { id: 'bus-1', userId: 'user-1', name: 'Store' };

  it('should throw an error if business does not exist', async () => {
    mockBusinessRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bus-1', 'user-1')).rejects.toThrow('Negocio no encontrado.');
  });

  it('should throw an error if user does not own the business', async () => {
    mockBusinessRepository.findById.mockResolvedValue(existingBusiness);
    await expect(useCase.execute('bus-1', 'hacker-1')).rejects.toThrow('No tienes permiso para acceder a este negocio.');
  });

  it('should throw an error if delete fails', async () => {
    mockBusinessRepository.findById.mockResolvedValue(existingBusiness);
    mockBusinessRepository.delete.mockResolvedValue(false); // DB Failure
    await expect(useCase.execute('bus-1', 'user-1')).rejects.toThrow('No se pudo eliminar el negocio de la base de datos.');
  });

  it('should successfully delete and return the deleted metadata', async () => {
    mockBusinessRepository.findById.mockResolvedValue(existingBusiness);
    mockBusinessRepository.delete.mockResolvedValue(true);

    const result = await useCase.execute('bus-1', 'user-1');
    expect(mockBusinessRepository.delete).toHaveBeenCalledWith('bus-1');
    expect(result.name).toBe('Store');
  });
});
