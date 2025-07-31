import { Request, Response } from 'express';
import { LoginUserUseCase } from '../../../../../contexts/user/useCases/loginUser.useCase';
import { TypeORMUserRepository } from '../../../../../contexts/user/infrastructure/persistance/typeorm/typeOrmUserRepository';
import { JwtTokenService } from '../../../../../contexts/user/infrastructure/security/jwtTokenService';

import { LoginRequestDto } from '../../../../../contexts/user/interfaces/dtos/loginRequest.dto';
import { UserResponseDto } from '../../../../../contexts/user/interfaces/dtos/userResponse.dto';
import { LoginResponseDto } from '../../../../../contexts/user/interfaces/dtos/loginResponse.dto';

export class LoginUserController {
  private loginUserUseCase: LoginUserUseCase;
  constructor() {
    const userRepository = new TypeORMUserRepository();
    const tokenGenerator = new JwtTokenService();
    this.loginUserUseCase = new LoginUserUseCase(
      userRepository,
      tokenGenerator
    );
  }

  async login(
    req: Request<any, any, LoginRequestDto>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ message: 'Se requiere correo electrónico y contraseña.' });
        return;
      }
      const result = await this.loginUserUseCase.login(email, password);

      const userResponse = new UserResponseDto(
        result.user.id,
        result.user.identification,
        result.user.name,
        result.user.lastName,
        result.user.email,
        result.user.city
      );
      const loginResponse = new LoginResponseDto(
        'Inicio de sesión exitoso.',
        userResponse,
        result.token
      );
      res.status(200).json(loginResponse);
    } catch (error: any) {
      if (
        error.message.includes('inválidas') ||
        error.message.includes('inválidas')
      ) {
        res.status(401).json({ message: error.message });
      } else {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }
}
