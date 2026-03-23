import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { DeleteBranchUseCase } from '../../../../../contexts/branch/useCases/deleteBranch.useCase';

export class DeleteBranchController {
  constructor(private deleteBranchUseCase: DeleteBranchUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userSession!.id;

      const deletedBranch = await this.deleteBranchUseCase.execute(id, userId);

      res.status(200).json({
        message: 'Sede eliminada con éxito.',
        data: deletedBranch,
      });
    } catch (error: any) {

      if (error.message.includes('No tienes permiso para eliminar esta sede.')) {
        res.status(403).json({ message: error.message });
        return;
      }


      if (error.message.includes('Sede no encontrada.')) {
        res.status(404).json({ message: error.message });
        return;
      }


      if (
        error.message.includes('No se puede eliminar esta sede porque tiene solicitudes de cotización activas.')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }


      console.error('[DeleteBranchController] Error inesperado:', error);
      res.status(500).json({
        message: 'Ocurrió un error interno al intentar eliminar la sede.',
      });
    }
  }
}
