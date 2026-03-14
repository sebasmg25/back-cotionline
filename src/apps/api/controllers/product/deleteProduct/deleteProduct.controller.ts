import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier'; // Importante para el blindaje
import { DeleteProductUseCase } from '../../../../../contexts/product/useCases/deleteProduct.useCase';

export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Extraemos el ID de la sesión del token
      const userIdSession = req.userSession!.id;

      // Pasamos ambos IDs: el del recurso y el del dueño
      const deletedProduct = await this.deleteProductUseCase.execute(
        id,
        userIdSession,
      );

      res.status(200).json({
        message: 'Producto eliminado con éxito.',
        data: deletedProduct, // Es buena práctica devolver lo que se borró
      });
    } catch (error: any) {
      // 1. No encontrado (404)
      if (error.message.includes('no encontrado')) {
        res.status(404).json({ message: error.message });
        return;
      }

      // 2. Error de permisos - Forbidden (403)
      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }

      // 3. Error técnico (500)
      console.error('[DeleteProductController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
