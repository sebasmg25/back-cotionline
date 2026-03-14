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
    // 1. Blindaje de existencia
    const existingUser = await this.userRepository.findById(userIdSession);
    if (!existingUser) throw new Error('El usuario no existe.');

    const updateFields: UserUpdateFields = {};
    let hasChanges = false;

    // 2. Mapeo de campos básicos
    if (request.name && request.name !== existingUser.name) {
      updateFields.name = request.name;
      hasChanges = true;
    }
    if (request.lastName && request.lastName !== existingUser.lastName) {
      updateFields.lastName = request.lastName;
      hasChanges = true;
    }

    // --- NUEVA LÓGICA: Validación Geográfica Dinámica ---
    const newDept = request.department || existingUser.department;
    const newCity = request.city || existingUser.city;

    // Si hubo algún intento de cambio en ubicación, validamos coherencia
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

      // Asignamos si son diferentes a lo que ya existe
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
    // ----------------------------------------------------

    // 3. Lógica de Password segura
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

    // 4. Blindaje de cambios
    if (!hasChanges) {
      throw new Error('No se detectaron cambios para actualizar.');
    }

    const updatedUser = await this.userRepository.update(
      userIdSession,
      updateFields,
    );

    if (!updatedUser)
      throw new Error('Error crítico al actualizar el usuario.');

    // 5. Retorno seguro mediante DTO de salida
    return UserResponseDto.toDto(updatedUser);
  }
}
