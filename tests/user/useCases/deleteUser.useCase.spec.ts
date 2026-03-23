import { DeleteUserUseCase } from '../../../src/contexts/user/useCases/deleteUser.useCase';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      delete: jest.fn()
    };
    useCase = new DeleteUserUseCase(mockUserRepository);
  });

  it('should throw an error if the user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('invalid-id')).rejects.toThrow('Usuario no encontrado o no tienes permiso para realizar esta acción.');
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });

  it('should successfully delete a user', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: 'valid-id' });
    mockUserRepository.delete.mockResolvedValue(undefined);

    await useCase.execute('valid-id');
    expect(mockUserRepository.delete).toHaveBeenCalledWith('valid-id');
  });
});
