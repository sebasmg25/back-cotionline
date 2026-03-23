import { UserRepository } from '../domain/repositories/user.repository';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userIdSession: string): Promise<void> {

    const user = await this.userRepository.findById(userIdSession);


    if (!user) {
      throw new Error(
        'Usuario no encontrado o no tienes permiso para realizar esta acción.',
      );
    }


    await this.userRepository.delete(userIdSession);
  }
}
