import { GetUserUseCase } from '../../../src/contexts/user/useCases/getUser.useCase';
import { User } from '../../../src/contexts/user/domain/models/user.model';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn()
    };
    useCase = new GetUserUseCase(mockUserRepository);
  });

  it('should throw an error if the user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('invalid-id')).rejects.toThrow('Usuario no encontrado.');
  });

  it('should return a user DTO successfully without password', async () => {
    const mockUser = new User('123', 'John', 'Doe', 'john@mail.com', 'hashed-pass', 'Antioquia', 'Medellín');
    Object.assign(mockUser, { id: 'user-id-123' });
    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute('user-id-123');
    
    expect(result.id).toBe('user-id-123');
    expect(result.email).toBe('john@mail.com');
    // Ensure the DTO mapped it out
    expect((result as any).password).toBeUndefined();
  });
});
