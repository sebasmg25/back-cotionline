import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetBranchesByBusinessIdUseCase } from '../../../../../contexts/branch/useCases/getBranchesByBusinessId.useCase';

export class GetBranchesByBusinessIdController {
  constructor(
    private getBranchesByBusinessIdUseCase: GetBranchesByBusinessIdUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { businessId } = req.params;
      const userSession = req.userSession!;

      const branches = await this.getBranchesByBusinessIdUseCase.execute(
        businessId,
        userSession,
      );

      res.status(200).json({
        message: 'Sedes obtenidas con éxito.',
        data: branches,
      });
    } catch (error: any) {
      // 1. Error de Autorización (403)
      if (
        error.message ===
        'No tienes permiso para ver las sedes de este negocio.'
      ) {
        res.status(403).json({ message: error.message });
        return;
      }

      // 2. Error de Negocio: No encontrado (404)
      if (error.message === 'El negocio especificado no existe.') {
        res.status(404).json({ message: error.message });
        return;
      }

      // 3. Error técnico
      console.error('[GetBranchesController] Error inesperado:', error);
      res
        .status(500)
        .json({ message: 'Error interno del servidor al obtener las sedes.' });
    }
  }
}
