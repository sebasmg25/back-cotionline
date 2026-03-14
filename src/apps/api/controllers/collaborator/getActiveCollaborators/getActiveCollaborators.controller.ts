import { Request, Response } from 'express';
import { GetActiveCollaboratorsUseCase } from '../../../../../contexts/collaborator/useCases/getActiveCollaborators.useCase';
import { AuthRequest } from '../../../middlewares/jwtVerifier';

export class GetActiveCollaboratorsController {
  constructor(private getActiveCollaboratorsUseCase: GetActiveCollaboratorsUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const ownerId = req.userSession?.id;

      if (!ownerId) {
        res.status(401).json({ message: 'No se encontró la sesión del usuario' });
        return;
      }

      const collaborators = await this.getActiveCollaboratorsUseCase.execute(ownerId);
      res.status(200).json(collaborators);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        message: 'Error al obtener colaboradores activos',
        details: error.message,
      });
    }
  }
}
