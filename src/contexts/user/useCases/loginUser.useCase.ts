import { User } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';
import {TokenGenerator} from '../domain/ports/tokenGenerator.port';


export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator
  ) {}

  async login(
    email: string,
    passwordPlain: string
  ): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error(
        'Tus credenciales son inválidas. Por favor verifica tu usuario y/o contraseña'
      );
    }

    const isPaswordValid = await (
      await import('bcrypt')
    ).compare(passwordPlain, user.password);

    if (!isPaswordValid) {
      throw new Error(
        'Tus credenciales son inválidas. Por favor verifica tu usuario y/o contraseña'
      );
    }

    const token = this.tokenGenerator.generateToken({
      id: user.id,
      identification: user.identification,
      lastName: user.lastName,
      email: user.email,
      name: user.name,
      city: user.city,
    });

    const { password, ...userWithouthPassword } = user;
    return { user: userWithouthPassword as User, token };
  }
}
