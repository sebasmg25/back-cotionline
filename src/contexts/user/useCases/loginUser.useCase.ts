import { UserRepository } from '../domain/repositories/user.repository';
import { TokenGenerator } from '../domain/ports/tokenGenerator.port';
import { PasswordHasher } from '../domain/ports/passwordHasher.port';
import { UserResponseDto, UserResponse } from '../interfaces/dtos/user.dto';
import { CollaboratorRepository } from '../../collaborator/domain/repositories/collaborator.repository';
import { UserRole } from '../domain/models/user.model';
import { InvitationStatus } from '../../collaborator/domain/models/collaborator.model';

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator,
    private passwordHasher: PasswordHasher,
    private collaboratorRepository: CollaboratorRepository,
  ) {}

  async execute(
    email: string,
    passwordPlain: string,
  ): Promise<{ user: UserResponse; token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error(
        'Tus credenciales son inválidas. Por favor verifica tu usuario y/o contraseña',
      );
    }

    const isPasswordValid = await this.passwordHasher.compare(
      passwordPlain,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error(
        'Tus credenciales son inválidas. Por favor verifica tu usuario y/o contraseña',
      );
    }

    // Identificar si es un colaborador
    let role = user.role || UserRole.OWNER;
    let ownerId = user.ownerId || undefined;

    // Si el usuario no tiene rol de colaborador explícito, verifiquemos si tiene una invitación aceptada
    if (role !== UserRole.COLLABORATOR) {
      const collaboratorInfo = await this.collaboratorRepository.findByEmail(email);
      if (collaboratorInfo && collaboratorInfo.invitationStatus === InvitationStatus.ACCEPTED) {
        role = UserRole.COLLABORATOR;
        ownerId = collaboratorInfo.userId;
      }
    }

    // Generación de sesión con los datos necesarios para el JWT
    const token = this.tokenGenerator.generateToken({
      id: user.id!,
      identification: user.identification,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      department: user.department,
      city: user.city,
      planId: user.planId,
      planStartDate: user.planStartDate,
      role,
      ownerId,
    });

    return {
      user: UserResponseDto.toDto(user),
      token,
    };
  }
}
