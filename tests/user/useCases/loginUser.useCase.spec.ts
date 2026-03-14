import { LoginUserUseCase } from '../../../src/contexts/user/useCases/loginUser.useCase';
import { User, UserRole } from '../../../src/contexts/user/domain/models/user.model';
import { InvitationStatus } from '../../../src/contexts/collaborator/domain/models/collaborator.model';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let mockUserRepository: any;
  let mockTokenGenerator: any;
  let mockPasswordHasher: any;
  let mockCollaboratorRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn()
    };
    mockTokenGenerator = {
      generateToken: jest.fn()
    };
    mockPasswordHasher = {
      compare: jest.fn()
    };
    mockCollaboratorRepository = {
      findByEmail: jest.fn()
    };

    useCase = new LoginUserUseCase(
      mockUserRepository,
      mockTokenGenerator,
      mockPasswordHasher,
      mockCollaboratorRepository
    );
  });

  it('should throw an error if the user is not found (invalid email)', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute('wrong@mail.com', 'password123'))
      .rejects.toThrow('Tus credenciales son inválidas. Por favor verifica tu usuario y/o contraseña');
  });

  it('should throw an error if the password does not match', async () => {
    const existingUser = new User(
      '123', 'John', 'Doe', 'john@mail.com', 'hashedpassword', 'Antioquia', 'Medellín'
    );
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);
    mockPasswordHasher.compare.mockResolvedValue(false); // Wrong password simulation

    await expect(useCase.execute('john@mail.com', 'wrongpassword'))
      .rejects.toThrow('Tus credenciales son inválidas. Por favor verifica tu usuario y/o contraseña');
  });

  it('should successfully login an owner and return a token', async () => {
    const existingUser = new User(
      '123', 'John', 'Doe', 'john@mail.com', 'hashedpassword', 'Antioquia', 'Medellín',
      'user-id', 'plan-id', new Date(), UserRole.OWNER
    );
    
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);
    mockPasswordHasher.compare.mockResolvedValue(true);
    mockCollaboratorRepository.findByEmail.mockResolvedValue(null);
    mockTokenGenerator.generateToken.mockReturnValue('valid-jwt-token');

    const result = await useCase.execute('john@mail.com', 'correctpassword');

    expect(result.token).toBe('valid-jwt-token');
    expect(result.user.email).toBe('john@mail.com');
    // Ensure the token generator is called with the role OWNER
    expect(mockTokenGenerator.generateToken).toHaveBeenCalledWith(expect.objectContaining({
      role: UserRole.OWNER
    }));
  });

  it('should successfully login a collaborator implicitly mapped by accepted invitation', async () => {
    // User stored in DB without explicit role yet
    const existingUser = new User(
      '123', 'John', 'Doe', 'collab@mail.com', 'hashedpassword', 'Antioquia', 'Medellín',
      'collab-id'
    );
    
    // Explicitly set the internal role property to undefined to simulate legacy users
    Object.defineProperty(existingUser, 'role', { value: undefined });

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);
    mockPasswordHasher.compare.mockResolvedValue(true);
    
    // Simulate an accepted invitation
    mockCollaboratorRepository.findByEmail.mockResolvedValue({
      invitationStatus: InvitationStatus.ACCEPTED,
      userId: 'owner-id' // The owner ID
    });
    mockTokenGenerator.generateToken.mockReturnValue('collab-jwt-token');

    const result = await useCase.execute('collab@mail.com', 'correctpassword');

    expect(result.token).toBe('collab-jwt-token');
    expect(mockTokenGenerator.generateToken).toHaveBeenCalledWith(expect.objectContaining({
      role: UserRole.COLLABORATOR,
      ownerId: 'owner-id'
    }));
  });
});
