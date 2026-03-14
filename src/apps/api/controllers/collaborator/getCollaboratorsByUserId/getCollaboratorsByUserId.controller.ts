import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetCollaboratorsByUserIdUseCase } from '../../../../../contexts/collaborator/useCases/getCollaboratorsByUserId.useCase';

export class GetCollaboratorsByUserIdController {
  constructor(
    private getCollaboratorsUseCase: GetCollaboratorsByUserIdUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Obtenemos el ID directamente del token para que nadie vea invitados ajenos
      const userIdSession = req.userSession!.id;

      const collaborators =
        await this.getCollaboratorsUseCase.execute(userIdSession);

      res.status(200).json({
        data: collaborators,
      });
    } catch (error: any) {
      // En este caso de uso es difícil que haya errores de negocio (si no hay, devuelve [])
      // pero mantenemos la estructura por consistencia
      console.error('[GetCollaboratorsByUserIdController] Error:', error);
      res
        .status(500)
        .json({
          message: 'Error interno al obtener la lista de colaboradores.',
        });
    }
  }
}
