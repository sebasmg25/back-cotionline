import { UserRepository } from '../domain/repositories/user.repository';
import { UserResponseDto, UserResponse } from '../interfaces/dtos/user.dto';

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userIdSession: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userIdSession);

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    return UserResponseDto.toDto(user);
  }
}
