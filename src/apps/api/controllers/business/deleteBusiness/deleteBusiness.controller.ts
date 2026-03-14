import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { DeleteBusinessUseCase } from '../../../../../contexts/business/useCases/deleteBusiness.useCase';

export class DeleteBusinessController {
  constructor(private deleteBusinessUseCase: DeleteBusinessUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userSession!.id;

      const deletedBusiness = await this.deleteBusinessUseCase.execute(
        id,
        userId,
      );

      res.status(200).json({
        message: 'Negocio eliminado exitosamente',
        data: deletedBusiness,
      });
    } catch (error: any) {
      // 1. No existe (404)
      if (error.message === 'Negocio no encontrado.') {
        res.status(404).json({ message: error.message });
        return;
      }

      // 2. Seguridad - No es el dueño (403)
      if (error.message === 'No tienes permiso para acceder a este negocio.') {
        res.status(403).json({ message: error.message });
        return;
      }

      // 3. Error en la persistencia (500)
      if (
        error.message === 'No se pudo eliminar el negocio de la base de datos.'
      ) {
        res.status(500).json({ message: error.message });
        return;
      }

      console.error('[DeleteBusinessController] Error inesperado:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
