import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { DeleteCollaboratorUseCase } from '../../../../../contexts/collaborator/useCases/deleteCollaborator.useCase';

export class DeleteCollaboratorController {
  constructor(private deleteCollaboratorUseCase: DeleteCollaboratorUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Extraemos el ID del usuario de la sesión para el blindaje
      const userIdSession = req.userSession!.id;

      // Pasamos ambos IDs al caso de uso
      const deletedCollaborator = await this.deleteCollaboratorUseCase.execute(
        id,
        userIdSession,
      );

      res.status(200).json({
        message: 'Colaborador eliminado con éxito.',
        data: deletedCollaborator,
      });
    } catch (error: any) {
      // 1. No encontrado (404)
      if (error.message.includes('no encontrado')) {
        res.status(404).json({ message: error.message });
        return;
      }

      // 2. Error de permisos (403 Forbidden)
      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }

      // 3. Error técnico
      console.error('[DeleteCollaboratorController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
