import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../../useCases/loginUser.useCase';
import { EnvConfig } from '../../../shared/infraestructure/env/envConfig';

export class JwtTokenService implements TokenGenerator {
  private secret: string;

  constructor() {
    this.secret = EnvConfig.get('JWT_SECRET');
    if (!this.secret) {
      throw new Error(
        'JWT_SECRET no esta definida en las variables de entorno'
      );
    }
  }

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }
}
