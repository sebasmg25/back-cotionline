import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { CreateCollaboratorUseCase } from '../../../../../contexts/collaborator/useCases/createCollaborator.useCase';
import { CreateCollaboratorRequest } from '../../../../../contexts/collaborator/interfaces/dtos/collaborator.dto';

export class CreateCollaboratorController {
  constructor(private createCollaboratorUseCase: CreateCollaboratorUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const userIdSession = req.userSession!.id;

      const data: CreateCollaboratorRequest = { email };

      const savedCollaborator = await this.createCollaboratorUseCase.execute(
        data,
        userIdSession,
      );

      res.status(201).json({
        message: 'Colaborador invitado exitosamente y correo enviado.',
        data: savedCollaborator,
      });
    } catch (error: any) {

      if (error.message.includes('limite')) {
        res.status(403).json({
          message: error.message,
          code: 'PLAN_LIMIT_REACHED',
        });
        return;
      }


      if (error.message.includes('Ya existe')) {
        res.status(409).json({ message: error.message });
        return;
      }


      if (error.message.includes('no encontrado')) {
        res.status(404).json({ message: error.message });
        return;
      }


      if (
        error.message.includes('plan asignado') ||
        error.message.includes('determinar')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }

      console.error('[CreateCollaboratorController] Error:', error);
      res.status(500).json({
        message: 'Error interno al procesar la invitación.',
      });
    }
  }
}
