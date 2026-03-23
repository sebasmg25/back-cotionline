import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { DeleteCollaboratorUseCase } from '../../../../../contexts/collaborator/useCases/deleteCollaborator.useCase';

export class DeleteCollaboratorController {
  constructor(private deleteCollaboratorUseCase: DeleteCollaboratorUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const userIdSession = req.userSession!.id;

      const deletedCollaborator = await this.deleteCollaboratorUseCase.execute(
        id,
        userIdSession,
      );

      res.status(200).json({
        message: 'Colaborador eliminado con éxito.',
        data: deletedCollaborator,
      });
    } catch (error: any) {

      if (error.message.includes('no encontrado')) {
        res.status(404).json({ message: error.message });
        return;
      }


      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }


      console.error('[DeleteCollaboratorController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
