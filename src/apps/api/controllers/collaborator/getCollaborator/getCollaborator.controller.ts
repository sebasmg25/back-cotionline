import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetCollaboratorUseCase } from '../../../../../contexts/collaborator/useCases/getCollaborator.useCase';

export class GetCollaboratorController {
  constructor(private getCollaboratorUseCase: GetCollaboratorUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const userIdSession = req.userSession!.id;

      const collaborator = await this.getCollaboratorUseCase.execute(
        id,
        userIdSession,
      );

      res.status(200).json({ data: collaborator });
    } catch (error: any) {

      if (error.message.includes('no encontrado')) {
        res.status(404).json({ message: error.message });
        return;
      }


      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }


      console.error('[GetCollaboratorController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
