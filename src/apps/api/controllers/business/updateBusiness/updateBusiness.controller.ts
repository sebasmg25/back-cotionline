import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { UpdateBusinessUseCase } from '../../../../../contexts/business/useCases/updateBusiness.useCase';
import { UpdateBusinessRequest } from '../../../../../contexts/business/interfaces/dtos/business.dto';

export class UpdateBusinessController {
  constructor(private updateBusinessUseCase: UpdateBusinessUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userSession!.id;

      // 1. Extraemos archivos de Multer
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // 2. Construimos el DTO combinando Body (texto) y Files (rutas)
      const updateData: UpdateBusinessRequest = {
        ...req.body,
        rutUrl: files?.['rut'] ? files['rut'][0].path : undefined,
        chamberOfCommerceUrl: files?.['chamberOfCommerce']
          ? files['chamberOfCommerce'][0].path
          : undefined,
      };

      // 3. Ejecutamos el caso de uso
      const updatedBusiness = await this.updateBusinessUseCase.execute(
        id,
        updateData,
        userId,
      );

      res.status(200).json({
        message: 'Negocio actualizado exitosamente',
        data: updatedBusiness,
      });
    } catch (error: any) {
      // Manejo de errores (se mantienen tus validaciones)
      const statusMap: Record<string, number> = {
        'El negocio que intentas actualizar no existe.': 404,
        'No tienes permiso para modificar este negocio.': 403,
        'Ya existe otro negocio registrado con este nit.': 409,
        'No se detectaron cambios en los campos enviados.': 400,
      };

      const status = statusMap[error.message] || 500;
      res.status(status).json({ message: error.message });

      if (status === 500)
        console.error('[UpdateBusinessController] Error:', error);
    }
  }
}
