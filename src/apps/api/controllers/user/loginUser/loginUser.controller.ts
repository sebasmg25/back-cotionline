import { Request, Response } from 'express';
import {validationResult} from 'express-validator'
import { LoginUserUseCase } from '../../../../../contexts/user/useCases/loginUser.useCase';
import { TypeORMUserRepository } from '../../../../../contexts/user/infrastructure/persistance/typeorm/typeOrmUserRepository';
import { JwtTokenService } from '../../../../../contexts/user/infrastructure/security/jwtTokenService';

import { UserRepository } from '../../../../../contexts/user/domain/repositories/user.repository';

export class LoginUserController {
  private loginUserUseCase: LoginUserUseCase;

  constructor() {
    const userRepository: UserRepository = new TypeORMUserRepository();
    const tokenGenerator: JwtTokenService = new JwtTokenService();
    this.loginUserUseCase = new LoginUserUseCase(
      userRepository,
      tokenGenerator
    );
  }

  async login(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors : errors.array()});
        return;
    }

    try {
      const {email, password} = req.body;
      const result = await this.loginUserUseCase.login(email, password);

      res.status(200).json(result);
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
