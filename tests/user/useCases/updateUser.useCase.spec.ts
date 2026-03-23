import { UpdateUserUseCase } from '../../../src/contexts/user/useCases/updateUser.useCase';
import { User } from '../../../src/contexts/user/domain/models/user.model';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockUserRepository: any;
  let mockPasswordHasher: any;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    mockPasswordHasher = {
      compare: jest.fn(),
      hash: jest.fn()
    };
    useCase = new UpdateUserUseCase(mockUserRepository, mockPasswordHasher);
  });

  const validSessionId = 'user-123';
  const existingUser = new User(
    '123', 'John', 'Doe', 'john@mail.com', 'hashed-pass', 'Antioquia', 'Medellín'
  );
  Object.assign(existingUser, { id: validSessionId });

  it('should throw an error if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(validSessionId, { name: 'New' }))
      .rejects.toThrow('El usuario no existe.');
  });

  it('should throw an error if no changes were detected', async () => {
    mockUserRepository.findById.mockResolvedValue(existingUser);
    
    await expect(useCase.execute(validSessionId, { name: 'John', lastName: 'Doe' }))
      .rejects.toThrow('No se detectaron cambios para actualizar.');
  });

  it('should throw an error if the new password is the same as the old one', async () => {
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockPasswordHasher.compare.mockResolvedValue(true); // Same password
    
    await expect(useCase.execute(validSessionId, { password: 'old-password' }))
      .rejects.toThrow('La nueva contraseña no puede ser igual a la anterior.');
  });

  it('should update name, lastName, and hash new password', async () => {
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockPasswordHasher.compare.mockResolvedValue(false);
    mockPasswordHasher.hash.mockResolvedValue('new-hashed-pass');
    
    // Simulate updated user returned by repo
    const updatedUser = new User('123', 'Jane', 'Smith', 'john@mail.com', 'new-hashed-pass', 'Antioquia', 'Medellín');
    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute(validSessionId, { name: 'Jane', lastName: 'Smith', password: 'new-password' });

    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('new-password');
    expect(mockUserRepository.update).toHaveBeenCalledWith(validSessionId, {
      name: 'Jane',
      lastName: 'Smith',
      password: 'new-hashed-pass'
    });
    expect(result.name).toBe('Jane');
  });

  it('should throw an error if department is invalid', async () => {
    mockUserRepository.findById.mockResolvedValue(existingUser);
    
    await expect(useCase.execute(validSessionId, { department: 'Atlantis' as any, city: 'Lost City' }))
      .rejects.toThrow("El departamento 'Atlantis' no es válido.");
  });

  it('should throw an error if the city does not belong to the department', async () => {
    mockUserRepository.findById.mockResolvedValue(existingUser);
    
    await expect(useCase.execute(validSessionId, { department: 'Cundinamarca', city: 'Medellín' }))
      .rejects.toThrow("La ciudad 'Medellín' no pertenece al departamento de Cundinamarca.");
  });

  it('should update department and city dynamically', async () => {
    mockUserRepository.findById.mockResolvedValue(existingUser);
    const updatedUser = new User('123', 'John', 'Doe', 'john@mail.com', 'hashed-pass', 'Cundinamarca', 'Soacha');
    mockUserRepository.update.mockResolvedValue(updatedUser);

    await useCase.execute(validSessionId, { department: 'Cundinamarca', city: 'Soacha' });

    expect(mockUserRepository.update).toHaveBeenCalledWith(validSessionId, {
      department: 'Cundinamarca',
      city: 'Soacha'
    });
  });

  it('should throw a critical error if the repository update fails to return the user', async () => {
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.update.mockResolvedValue(null); // Failure during update
    
    await expect(useCase.execute(validSessionId, { name: 'Jane' }))
      .rejects.toThrow('Error crítico al actualizar el usuario.');
  });
});
