import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { MarkNotificationAsReadUseCase } from '../../../../../contexts/notification/useCases/markNotificationAsRead.useCase';

export class MarkNotificationAsReadController {
  constructor(private markAsReadUseCase: MarkNotificationAsReadUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params; // ID de la notificación
      const userIdSession = req.userSession!.id;

      await this.markAsReadUseCase.execute(id, userIdSession);

      res.status(200).json({
        message: 'Notificación marcada como leída correctamente',
      });
    } catch (error: any) {
      // 1. No existe (404)
      if (error.message.includes('no existe')) {
        res.status(404).json({ message: error.message });
        return;
      }

      // 2. Sin permiso / Propiedad (403)
      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }

      // 3. Error técnico
      console.error('[MarkNotificationAsReadController] Error:', error);
      res.status(500).json({
        message: 'Error interno al actualizar la notificación',
      });
    }
  }
}
