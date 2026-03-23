import { User, UserRole } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';
import {
  UserResponseDto,
  UserResponse,
  CreateUserRequest,
} from '../interfaces/dtos/user.dto';
import { TokenGenerator } from '../domain/ports/tokenGenerator.port';
import { PasswordHasher } from '../domain/ports/passwordHasher.port';
import { PlanRepository } from '../../subscription/domain/repositories/plan.repository';
import { PlanName } from '../../subscription/domain/models/plan.model';
import { COLOMBIAN_DATA } from '../../shared/domain/constants/cities.data';
import { CollaboratorRepository } from '../../collaborator/domain/repositories/collaborator.repository';
import { InvitationStatus } from '../../collaborator/domain/models/collaborator.model';

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator,
    private passwordHasher: PasswordHasher,
    private planRepository: PlanRepository,
    private collaboratorRepository: CollaboratorRepository,
  ) {}

  async execute(
    request: CreateUserRequest,
  ): Promise<{ user: UserResponse; token: string }> {

    const existIdentification = await this.userRepository.findByIdentification(
      request.identification,
    );
    if (existIdentification) {
      throw new Error(
        'Ya existe un cliente registrado con este numero de identificación',
      );
    }

    const existEmail = await this.userRepository.findByEmail(request.email);
    if (existEmail) {
      throw new Error(
        'Ya existe un cliente registrado con este correo electrónico',
      );
    }

    const citiesInDept = COLOMBIAN_DATA[request.department];

    if (!citiesInDept) {
      throw new Error(`El departamento '${request.department}' no es válido.`);
    }

    if (!citiesInDept.includes(request.city)) {
      throw new Error(
        `La ciudad '${request.city}' no pertenece al departamento de ${request.department}.`,
      );
    }

    // Identificar si es un colaborador
    let role = UserRole.OWNER;
    let ownerId: string | undefined = undefined;

    const collaboratorInfo = await this.collaboratorRepository.findByEmail(request.email);
    if (collaboratorInfo && collaboratorInfo.invitationStatus === InvitationStatus.ACCEPTED) {
      role = UserRole.COLLABORATOR;
      ownerId = collaboratorInfo.userId;
    }


    let planId: string | undefined = undefined;
    if (role === UserRole.OWNER) {
      const defaultPlan = await this.planRepository.findByName(PlanName.FREE);
      if (!defaultPlan) {
        throw new Error('Error crítico: No existe un plan inicial configurado.');
      }
      planId = defaultPlan.id;
    }


    const hashedPassword = await this.passwordHasher.hash(request.password);


    const userToSave = new User(
      request.identification,
      request.name,
      request.lastName,
      request.email,
      hashedPassword,
      request.department,
      request.city,
      undefined, 
      planId,
      role === UserRole.OWNER ? new Date() : undefined,
      role,
      ownerId,
    );

    const savedUser = await this.userRepository.save(userToSave);


    const token = this.tokenGenerator.generateToken({
      id: savedUser.id!,
      identification: savedUser.identification,
      email: savedUser.email,
      name: savedUser.name,
      lastName: savedUser.lastName,
      department: savedUser.department,
      city: savedUser.city,
      planId: savedUser.planId,
      planStartDate: savedUser.planStartDate,
      role: savedUser.role,
      ownerId: savedUser.ownerId,
    });


    return {
      user: UserResponseDto.toDto(savedUser),
      token,
    };
  }
}
