import { Response, NextFunction } from 'express';
import { AuthRequest } from './jwtVerifier';
import { TypeORMBusinessRepository } from '../../../contexts/business/infraestructure/persistance/typeorm/typeOrmBusinessRepository';
import { BusinessStatus } from '../../../contexts/business/domain/models/business.model';

export class BusinessStatusValidator {
  private static businessRepository = new TypeORMBusinessRepository();

  static async handler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userSession = req.userSession;
      const effectiveOwnerId = userSession?.ownerId || userSession?.id;

      if (!effectiveOwnerId) {
        return res.status(401).json({ message: 'Usuario no identificado.' });
      }

      const business =
        await BusinessStatusValidator.businessRepository.findByUserId(
          effectiveOwnerId,
        );

      // Caso 1: Ni siquiera ha registrado el negocio
      if (!business) {
        return res.status(403).json({
          message: 'Debes registrar tu negocio para realizar esta acción.',
          code: 'NO_BUSINESS_REGISTERED',
        });
      }

      // Caso 2: El negocio existe pero no está verificado
      if (business.status !== BusinessStatus.VERIFIED) {
        return res.status(403).json({
          message:
            'Tu cuenta está en proceso de validación. Esta función está temporalmente bloqueada.',
          code: 'BUSINESS_PENDING_VERIFICATION',
          currentStatus: business.status,
        });
      }

      // Caso 3: Todo OK
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al verificar estado del negocio.' });
    }
  }
}
