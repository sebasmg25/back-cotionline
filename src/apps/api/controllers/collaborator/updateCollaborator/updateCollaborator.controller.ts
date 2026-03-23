import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { UpdateCollaboratorUseCase } from '../../../../../contexts/collaborator/useCases/updateCollaborator.useCase';

export class UpdateCollaboratorController {
  constructor(private updateCollaboratorUseCase: UpdateCollaboratorUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email } = req.body;
      const userIdSession = req.userSession!.id;

      const updatedCollaborator = await this.updateCollaboratorUseCase.execute(
        id,
        userIdSession,
        email,
      );

      res.status(200).json({
        message: 'Colaborador actualizado exitosamente',
        data: updatedCollaborator,
      });
    } catch (error: any) {

      if (error.message.includes('no existe')) {
        res.status(404).json({ message: error.message });
        return;
      }


      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }


      if (error.message.includes('No se detectaron cambios')) {
        res.status(400).json({ message: error.message });
        return;
      }


      if (error.message.includes('Error al actualizar')) {
        res.status(500).json({ message: error.message });
        return;
      }

      console.error('[UpdateCollaboratorController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
