import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { UpdateProductUseCase } from '../../../../../contexts/product/useCases/updateProduct.useCase';

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userIdSession = req.userSession!.id;

      const updatedProduct = await this.updateProductUseCase.execute(
        id,
        userIdSession,
        req.body,
      );

      res.status(200).json({
        message: 'Producto actualizado exitosamente',
        data: updatedProduct,
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


      if (error.message.includes('Ya existe')) {
        res.status(409).json({ message: error.message });
        return;
      }

      console.error('[UpdateProductController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
