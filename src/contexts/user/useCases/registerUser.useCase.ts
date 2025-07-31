import { User } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  private emailIsValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private passwordIsValid(password: string): boolean {
    if (password.length > 12) {
      throw new Error(
        'La contraseña supera el máximo de 12 caracteres permitidos.'
      );
    }

    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      throw new Error(
        'La contraseña debe contener al menos una letra mayúscula.'
      );
    }

    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) {
      throw new Error('La contraseña debe contener al menos un número.');
    }

    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(
      password
    );
    if (!hasSpecialChar) {
      throw new Error(
        'La contraseña debe contener al menos un caracter especial.'
      );
    }

    return true;
  }

  async saveUser(
    identification: string,
    name: string,
    lastName: string,
    email: string,
    password: string,
    city: string
  ) {
    if (!this.emailIsValid(email)) {
      throw new Error('El formato de correo es invalido');
    }

    this.passwordIsValid(password);

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
