import { User } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async saveUser(
    identification: string,
    name: string,
    lastName: string,
    email: string,
    password: string,
    city: string
  ) {
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

    const saveUser = new User(
      identification,
      name,
      lastName,
      email,
      password,
      city
    );
    const savedUser = await this.userRepository.save(saveUser);
    return savedUser;
  }
}
