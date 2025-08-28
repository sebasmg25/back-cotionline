import { User } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';
import { RegisterUserRequestDto } from '../interfaces/dtos/registerUserRequest.dto';
import { UserResponseDto } from '../interfaces/dtos/userResponse.dto';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async saveUser(
    userRequestDto: UserResponseDto
    // identification: string,
    // name: string,
    // lastName: string,
    // email: string,
    // password: string,
    // city: string
  ): Promise<UserResponseDto> {
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
    // const saveUser = new User(
    //   identification,
    //   name,
    //   lastName,
    //   email,
    //   password,
    //   city
    // );
    // const savedUser = await this.userRepository.save(saveUser);

    // Mapea el modelo de dominio a un DTO de Salida
    return UserResponseDto.toDto(savedUser);
    // const userResponseData: UserResponseDto = {
    //   id: savedUser.id!,
    //   identification: savedUser.identification,
    //   name: savedUser.name,
    //   lastName: savedUser.lastName,
    //   email: savedUser.email,
    //   city: savedUser.city,
    // };
    // return userResponseData;
  }
}
