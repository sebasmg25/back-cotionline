import { Request, Response } from 'express';
import { RejectInvitationUseCase } from '../../../../../contexts/collaborator/useCases/rejectInvitation.useCase';

export class RejectInvitationController {
  constructor(private rejectInvitationUseCase: RejectInvitationUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const updatedCollaborator =
        await this.rejectInvitationUseCase.execute(id);

      res.status(200).json({
        message: '¡Invitación rechazada y dueño notificado!',
        data: updatedCollaborator,
      });
    } catch (error: any) {
      // 1. No encontrada (404)
      if (error.message.includes('no encontrada')) {
        res.status(404).json({ message: error.message });
        return;
      }

      // 2. Conflicto: Ya aceptada anteriormente (409)
      if (error.message.includes('ya ha sido aceptada')) {
        res.status(409).json({ message: error.message });
        return;
      }

      // 3. Error al persistir el cambio (500)
      if (error.message.includes('No se pudo actualizar')) {
        res.status(500).json({ message: error.message });
        return;
      }

      // 4. Error técnico inesperado
      console.error('[RejectInvitationController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
