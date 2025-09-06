import { User } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserResponseDto } from '../interfaces/dtos/userResponse.dto';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async saveUser(userRequestDto: UserResponseDto): Promise<UserResponseDto> {
    const { identification, name, lastName, email, password, city } =
      userRequestDto;

    const existIdentification = await this.userRepository.findByIdentification(
      identification
    );
    const existEmail = await this.userRepository.findByEmail(email);
    if (existIdentification) {
      throw new Error(
        'Ya existe un cliente registrado con este numero de identificación'
      );
    } else if (existEmail) {
      throw new Error(
        'Ya existe un cliente registrado con este correo electrónico'
      );
    }

    const userSave: User = userRequestDto.fromDto();
    const savedUser = await this.userRepository.save(userSave);

    return UserResponseDto.toDto(savedUser);
  }
}
