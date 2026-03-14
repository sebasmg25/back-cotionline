import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { UpdateBranchUseCase } from '../../../../../contexts/branch/useCases/updateBranch.useCase';
import { UpdateBranchRequest } from '../../../../../contexts/branch/interfaces/dtos/branch.dto';

export class UpdateBranchController {
  constructor(private updateBranchUseCase: UpdateBranchUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userSession!.id; // Extraído del token
      const branchData: UpdateBranchRequest = req.body;

      const updateBranch = await this.updateBranchUseCase.execute(
        id,
        branchData,
        userId,
      );

      res.status(200).json({
        message: 'Sede actualizada exitosamente',
        data: updateBranch,
      });
    } catch (error: any) {
      // 1. Error de Autorización (403 Forbidden)
      if (error.message === 'No tienes permiso para modificar esta sede.') {
        res.status(403).json({ message: error.message });
        return;
      }

      // 2. No existe (404 Not Found)
      if (error.message === 'La sede que intentas actualizar no existe') {
        res.status(404).json({ message: error.message });
        return;
      }

      // 3. Sin cambios (400 Bad Request)
      if (
        error.message === 'No se detectaron cambios en los campos enviados.'
      ) {
        res.status(400).json({ message: error.message });
        return;
      }

      // Dentro del bloque catch del handle:
      if (
        error.message ===
        'La ciudad proporcionada no es válida en nuestro registro oficial.'
      ) {
        res.status(400).json({ message: error.message });
        return;
      }

      // 4. Error técnico o de persistencia
      if (error.message === 'Error al actualizar') {
        res.status(500).json({ message: error.message });
        return;
      }

      console.error('[UpdateBranchController] Error inesperado:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
