import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { VerifyBusinessUseCase } from '../../../../../contexts/business/useCases/verifyBusiness.useCase';

export class VerifyBusinessController {
  constructor(private verifyBusinessUseCase: VerifyBusinessUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // IMPORTANTE: Aquí podrías añadir una validación de Rol
      // if (req.userSession!.role !== 'ADMIN') {
      //   res.status(403).json({ message: 'No tienes permisos de administrador.' });
      //   return;
      // }

      const updatedBusiness = await this.verifyBusinessUseCase.execute(
        id,
        status,
      );

      res.status(200).json({
        message: `Estado del negocio actualizado a ${status} con éxito.`,
        data: updatedBusiness,
      });
    } catch (error: any) {
      if (error.message === 'Negocio no encontrado') {
        res.status(404).json({ message: error.message });
        return;
      }

      if (error.message === 'Error al actualizar el estado del negocio.') {
        res.status(500).json({ message: error.message });
        return;
      }

      console.error('[VerifyBusinessController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
