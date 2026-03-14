import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { EnvConfig } from '../../../contexts/shared/infraestructure/env/envConfig';

import { UserRole } from '../../../contexts/user/domain/models/user.model';

// 1. Definimos una interfaz limpia para el Payload del Token
// Esto ayuda a que el autocompletado sepa qué hay dentro del token
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

// 2. Extendemos la Request de Express de forma global para este archivo
export interface AuthRequest extends Request {
  userSession?: UserPayload;
}

export class JwtVerifier {
  static handler(req: AuthRequest, res: Response, next: NextFunction) {
    const secret = EnvConfig.get('JWT_SECRET');
    const authHeader = req.headers.authorization;

    // Validación de existencia del Header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(403).json({
        error: 'Acceso denegado: Token no proporcionado o formato inválido.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verificamos y casteamos el payload
      const payload = jwt.verify(token, secret) as unknown as UserPayload;

      // Centralizamos todo en userSession
      req.userSession = payload;

      next();
    } catch (error) {
      console.error('--- [Middleware] Error al verificar token ---', error);
      res.status(401).json({ error: 'Token inválido o expirado.' });
    }
  }
}
