import { UserRepository } from '../domain/repositories/user.repository';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  /**
   * Elimina la cuenta del usuario autenticado.
   * @param userIdSession ID extraído directamente del Token (JWT)
   */
  async execute(userIdSession: string): Promise<void> {
    // 1. Buscamos el usuario para confirmar que la sesión sigue siendo válida en DB
    const user = await this.userRepository.findById(userIdSession);

    // 2. Blindaje: Si el ID no existe, lanzamos error de negocio/permisos
    if (!user) {
      throw new Error(
        'Usuario no encontrado o no tienes permiso para realizar esta acción.',
      );
    }

    // 3. Ejecución de la eliminación física o lógica (según tu repositorio)
    await this.userRepository.delete(userIdSession);
  }
}
