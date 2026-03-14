import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { UpdateProductUseCase } from '../../../../../contexts/product/useCases/updateProduct.useCase';

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userIdSession = req.userSession!.id;

      // Pasamos el ID, el ID de sesión y el body completo como 'data'
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
      // 1. No existe (404)
      if (error.message.includes('no existe')) {
        res.status(404).json({ message: error.message });
        return;
      }

      // 2. Seguridad - Forbidden (403)
      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }

      // 3. Sin cambios (400)
      if (error.message.includes('No se detectaron cambios')) {
        res.status(400).json({ message: error.message });
        return;
      }

      // 4. Conflicto (409) - Por si el repositorio valida nombres únicos
      if (error.message.includes('Ya existe')) {
        res.status(409).json({ message: error.message });
        return;
      }

      console.error('[UpdateProductController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
