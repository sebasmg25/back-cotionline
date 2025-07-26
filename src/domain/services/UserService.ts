import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

export interface TokenGenerator {
  generateToken(payload: object): string;
}


export class UserService {
  constructor(private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator
  ) {
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

  async login(email: string, passwordPlain: string): Promise<{user: User; token: string}>{
    const user = await this.userRepository.findByEmail(email);

    if(!user){
      throw new Error('Tus credenciales son inválidas. Por favor verifica tu usuario y/o contraseña');
    }

    const isPaswordValid = await( await import('bcrypt')).compare(passwordPlain, user.password);

    if(!isPaswordValid){
      throw new Error('Tus credenciales son inválidas. Por favor verifica tu usuario y/o contraseña');
    }

    const token = this.tokenGenerator.generateToken({
      id : user.id,
      identification : user.identification,
      lastName : user.lastName,
      email : user.email,
      name : user.name,
      city: user.city
    });

    const {password, ...userWithouthPassword} = user;
    return{user: userWithouthPassword as User, token};
  }
}
