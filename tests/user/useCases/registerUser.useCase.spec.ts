import { RegisterUserUseCase } from '../../../src/contexts/user/useCases/registerUser.useCase';
import { User, UserRole } from '../../../src/contexts/user/domain/models/user.model';
import { PlanName } from '../../../src/contexts/subscription/domain/models/plan.model';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: any;
  let mockTokenGenerator: any;
  let mockPasswordHasher: any;
  let mockPlanRepository: any;
  let mockCollaboratorRepository: any;

  beforeEach(() => {
    // 1. Create Mocks for all dependencies
    mockUserRepository = {
      findByIdentification: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn()
    };
    mockTokenGenerator = {
      generateToken: jest.fn()
    };
    mockPasswordHasher = {
      hash: jest.fn()
    };
    mockPlanRepository = {
      findByName: jest.fn()
    };
    mockCollaboratorRepository = {
      findByEmail: jest.fn()
    };

    // 2. Inject Mocks into the UseCase
    useCase = new RegisterUserUseCase(
      mockUserRepository,
      mockTokenGenerator,
      mockPasswordHasher,
      mockPlanRepository,
      mockCollaboratorRepository
    );
  });

  it('should throw an error if the email already exists', async () => {
    // ARRANGE: Setup the mock to return an existing user to simulate email collision
    const request = {
      identification: '123456',
      name: 'Test',
      lastName: 'User',
      email: 'test@mail.com',
      password: 'password123',
      department: 'Antioquia',
      city: 'Medellín'
    };

    mockUserRepository.findByIdentification.mockResolvedValue(null); // ID is fine
    mockUserRepository.findByEmail.mockResolvedValue(new User(
      '999999', 'Existing', 'User', 'test@mail.com', 'hashed', 'Antioquia', 'Medellín'
    )); // Email exists

    // ACT & ASSERT: Expect the use case to fail with the specific error message
    await expect(useCase.execute(request)).rejects.toThrow('Ya existe un cliente registrado con este correo electrónico');
    
    // Ensure save was never called because it failed early
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should successfully register a new owner user and return a token', async () => {
    // ARRANGE
    const request = {
      identification: '123456',
      name: 'Test',
      lastName: 'User',
      email: 'new@mail.com',
      password: 'password123',
      department: 'Antioquia',
      city: 'Medellín'
    };

    const savedUser = new User(
      request.identification, request.name, request.lastName, request.email, 'hashedPassword',
      request.department, request.city, 'generated-id', 'plan-id', new Date(), UserRole.OWNER
    );

    mockUserRepository.findByIdentification.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockCollaboratorRepository.findByEmail.mockResolvedValue(null);
    mockPlanRepository.findByName.mockResolvedValue({ id: 'plan-id', name: PlanName.FREE });
    mockPasswordHasher.hash.mockResolvedValue('hashedPassword');
    mockUserRepository.save.mockResolvedValue(savedUser);
    mockTokenGenerator.generateToken.mockReturnValue('mocked-jwt-token');

    // ACT
    const result = await useCase.execute(request);

    // ASSERT
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(result.token).toBe('mocked-jwt-token');
    expect(result.user.email).toBe('new@mail.com');
  });
});
