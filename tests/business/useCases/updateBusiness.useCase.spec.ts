import { UpdateBusinessUseCase } from '../../../src/contexts/business/useCases/updateBusiness.useCase';

describe('UpdateBusinessUseCase', () => {
  let useCase: UpdateBusinessUseCase;
  let mockBusinessRepository: any;

  beforeEach(() => {
    mockBusinessRepository = {
      findById: jest.fn(),
      findByNit: jest.fn(),
      update: jest.fn()
    };
    useCase = new UpdateBusinessUseCase(mockBusinessRepository);
  });

  const existingBusiness = { id: 'bus-1', userId: 'user-1', nit: '111', name: 'Old Name' };

  it('should throw an error if business does not exist', async () => {
    mockBusinessRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bus-1', {}, 'user-1')).rejects.toThrow('El negocio que intentas actualizar no existe.');
  });

  it('should throw an error if user does not have permission', async () => {
    mockBusinessRepository.findById.mockResolvedValue(existingBusiness);
    await expect(useCase.execute('bus-1', {}, 'hacker-1')).rejects.toThrow('No tienes permiso para modificar este negocio.');
  });

  it('should throw an error if attempting to change to an already existing NIT', async () => {
    mockBusinessRepository.findById.mockResolvedValue(existingBusiness);
    mockBusinessRepository.findByNit.mockResolvedValue({ id: 'bus-2' }); // Another business has this NIT

    await expect(useCase.execute('bus-1', { nit: '222' }, 'user-1')).rejects.toThrow('Ya existe otro negocio registrado con este nit.');
  });

  it('should throw an error if no fields were changed', async () => {
    mockBusinessRepository.findById.mockResolvedValue(existingBusiness);
    await expect(useCase.execute('bus-1', {}, 'user-1')).rejects.toThrow('No se detectaron cambios en los campos enviados.');
  });

  it('should throw an error if update repository fails', async () => {
    mockBusinessRepository.findById.mockResolvedValue(existingBusiness);
    mockBusinessRepository.update.mockResolvedValue(null); // Simulated DB update failure

    await expect(useCase.execute('bus-1', { name: 'New Name' }, 'user-1')).rejects.toThrow('Error al actualizar el negocio.');
  });

  it('should successfully update and return the business', async () => {
    mockBusinessRepository.findById.mockResolvedValue(existingBusiness);
    
    // Changing name and NIT
    mockBusinessRepository.findByNit.mockResolvedValue(null);
    const updatedModel = { ...existingBusiness, name: 'New Name', nit: '222', rutUrl: 'http://new-rut.com' };
    mockBusinessRepository.update.mockResolvedValue(updatedModel);

    const result = await useCase.execute('bus-1', { name: 'New Name', nit: '222', rutUrl: 'http://new-rut.com' }, 'user-1');
    
    expect(mockBusinessRepository.update).toHaveBeenCalledWith('bus-1', {
      name: 'New Name',
      nit: '222',
      rutUrl: 'http://new-rut.com'
    });
    expect(result.name).toBe('New Name');
    expect(result.nit).toBe('222');
  });
});
