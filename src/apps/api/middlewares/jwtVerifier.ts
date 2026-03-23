import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { EnvConfig } from '../../../contexts/shared/infraestructure/env/envConfig';

import { UserRole } from '../../../contexts/user/domain/models/user.model';

export interface UserPayload {
  id: string;
  email: string;
  identification: string;
  name: string;
  lastName: string;
  department: string;
  city: string;
  planId?: string;
  planStartDate?: Date;
  role: UserRole;
  ownerId?: string;
}


export interface AuthRequest extends Request {
  userSession?: UserPayload;
}

export class JwtVerifier {
  static handler(req: AuthRequest, res: Response, next: NextFunction) {
    const secret = EnvConfig.get('JWT_SECRET');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(403).json({
        error: 'Acceso denegado: Token no proporcionado o formato inválido.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, secret) as unknown as UserPayload;
      req.userSession = payload;

      next();
    } catch (error) {
      console.error('--- [Middleware] Error al verificar token ---', error);
      res.status(401).json({ error: 'Token inválido o expirado.' });
    }
  }
}
