import {
  UserRepository,
  UserUpdateFields,
} from '../domain/repositories/user.repository';
import { PasswordHasher } from '../domain/ports/passwordHasher.port';
import {
  UserResponseDto,
  UserResponse,
  UpdateUserRequest,
} from '../interfaces/dtos/user.dto';
import { COLOMBIAN_DATA } from '../../shared/domain/constants/cities.data';

export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(
    userIdSession: string,
    request: UpdateUserRequest,
  ): Promise<UserResponse> {

    const existingUser = await this.userRepository.findById(userIdSession);
    if (!existingUser) throw new Error('El usuario no existe.');

    const updateFields: UserUpdateFields = {};
    let hasChanges = false;


    if (request.name && request.name !== existingUser.name) {
      updateFields.name = request.name;
      hasChanges = true;
    }
    if (request.lastName && request.lastName !== existingUser.lastName) {
      updateFields.lastName = request.lastName;
      hasChanges = true;
    }

    const newDept = request.department || existingUser.department;
    const newCity = request.city || existingUser.city;

    if (request.department || request.city) {
      const citiesInDept = COLOMBIAN_DATA[newDept];

      if (!citiesInDept) {
        throw new Error(`El departamento '${newDept}' no es válido.`);
      }

      if (!citiesInDept.includes(newCity)) {
        throw new Error(
          `La ciudad '${newCity}' no pertenece al departamento de ${newDept}.`,
        );
      }

      if (
        request.department &&
        request.department !== existingUser.department
      ) {
        updateFields.department = request.department;
        hasChanges = true;
      }
      if (request.city && request.city !== existingUser.city) {
        updateFields.city = request.city;
        hasChanges = true;
      }
    }

    if (request.password && request.password.trim() !== '') {
      const isSamePassword = await this.passwordHasher.compare(
        request.password,
        existingUser.password,
      );

      if (isSamePassword) {
        throw new Error(
          'La nueva contraseña no puede ser igual a la anterior.',
        );
      }

      updateFields.password = await this.passwordHasher.hash(request.password);
      hasChanges = true;
    }


    if (!hasChanges) {
      throw new Error('No se detectaron cambios para actualizar.');
    }

    const updatedUser = await this.userRepository.update(
      userIdSession,
      updateFields,
    );

    if (!updatedUser)
      throw new Error('Error crítico al actualizar el usuario.');


    return UserResponseDto.toDto(updatedUser);
  }
}
