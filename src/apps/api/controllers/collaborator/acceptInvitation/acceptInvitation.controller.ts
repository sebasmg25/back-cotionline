import { Request, Response } from 'express';
import { AcceptInvitationUseCase } from '../../../../../contexts/collaborator/useCases/acceptInvitation.useCase';

export class AcceptInvitationController {
  constructor(private acceptInvitationUseCase: AcceptInvitationUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const collaborator = await this.acceptInvitationUseCase.execute(id);

      res.status(200).json({
        message: '¡Invitación aceptada y dueño notificado!',
        data: collaborator,
      });
    } catch (error: any) {
      // 1. No encontrada (404)
      if (error.message.includes('no encontrada')) {
        res.status(404).json({ message: error.message });
        return;
      }

      // 2. Ya procesada (409 Conflict)
      if (error.message.includes('ya ha sido aceptada')) {
        res.status(409).json({ message: error.message });
        return;
      }

      // 3. Error de persistencia (500)
      if (error.message.includes('No se pudo actualizar')) {
        res.status(500).json({ message: error.message });
        return;
      }

      console.error('[AcceptInvitationController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
