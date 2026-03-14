import { Request, Response } from 'express';
import { DeleteActiveCollaboratorUseCase } from '../../../../../contexts/collaborator/useCases/deleteActiveCollaborator.useCase';
import { AuthRequest } from '../../../middlewares/jwtVerifier';

export class DeleteActiveCollaboratorController {
  constructor(private deleteActiveCollaboratorUseCase: DeleteActiveCollaboratorUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const ownerId = req.userSession?.id;
      const { id: collaboratorId } = req.params;

      if (!ownerId) {
        res.status(401).json({ message: 'No se encontró la sesión del usuario' });
        return;
      }

      await this.deleteActiveCollaboratorUseCase.execute(collaboratorId, ownerId);
      res.status(200).json({ message: 'Colaborador eliminado exitosamente' });
    } catch (error: any) {
      console.error(error);
      const statusCode =
        error.message.includes('permisos') || error.message.includes('propiedad')
          ? 403
          : error.message.includes('existe')
          ? 404
          : 500;
      res.status(statusCode).json({
        message: 'Error al eliminar el colaborador',
        details: error.message,
      });
    }
  }
}
