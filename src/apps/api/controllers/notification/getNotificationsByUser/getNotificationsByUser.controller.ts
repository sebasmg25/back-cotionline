import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetNotificationsByUserUseCase } from '../../../../../contexts/notification/useCases/getNotificacionsByUser.useCase';

export class GetNotificationsByUserController {
  constructor(private getNotificationsUseCase: GetNotificationsByUserUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      // SEGURIDAD: Extraemos el ID del token, no de los parámetros
      const userSession = req.userSession!;

      const notifications =
        await this.getNotificationsUseCase.execute(userSession);

      res.status(200).json({
        message: 'Notificaciones obtenidas con éxito',
        data: notifications,
      });
    } catch (error: any) {
      console.error('[GetNotificationsByUserController] Error:', error);
      res.status(500).json({
        message: 'Error interno al obtener notificaciones',
      });
    }
  }
}
