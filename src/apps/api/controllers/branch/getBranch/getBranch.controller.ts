import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetBranchUseCase } from '../../../../../contexts/branch/useCases/getBranch.useCase';

export class GetBranchController {
  constructor(private getBranchUseCase: GetBranchUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userSession!.id;

      const branch = await this.getBranchUseCase.execute(id, userId);

      res.status(200).json({
        message: 'Sede obtenida con éxito.',
        data: branch,
      });
    } catch (error: any) {
      // 1. Error de Autorización (403)
      if (error.message === 'No tienes permiso para ver esta sede.') {
        res.status(403).json({ message: error.message });
        return;
      }

      // 2. Error de Negocio: No encontrado (404)
      if (error.message === 'Sede no encontrada.') {
        res.status(404).json({ message: error.message });
        return;
      }

      // 3. Error técnico
      console.error('[GetBranchController] Error inesperado:', error);
      res
        .status(500)
        .json({ message: 'Error interno del servidor al obtener la sede.' });
    }
  }
}
