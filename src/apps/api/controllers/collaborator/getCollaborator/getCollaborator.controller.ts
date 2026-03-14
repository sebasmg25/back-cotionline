import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetCollaboratorUseCase } from '../../../../../contexts/collaborator/useCases/getCollaborator.useCase';

export class GetCollaboratorController {
  constructor(private getCollaboratorUseCase: GetCollaboratorUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Extraemos el ID del usuario de la sesión (Token)
      const userIdSession = req.userSession!.id;

      // Pasamos el ID del colaborador y el del dueño para validar propiedad
      const collaborator = await this.getCollaboratorUseCase.execute(
        id,
        userIdSession,
      );

      res.status(200).json({ data: collaborator });
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

      // 3. Error técnico inesperado
      console.error('[GetCollaboratorController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
