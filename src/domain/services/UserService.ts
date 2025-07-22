import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor(private userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async saveUser(
    identification: string,
    name: string,
    lastName: string,
    email: string,
    password: string,
    city: string
  ) {
    const existId = await this.userRepository.findByIdentification(
      identification
    );
    const existEmail = await this.userRepository.findByEmail(email);
    if (existId) {
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
