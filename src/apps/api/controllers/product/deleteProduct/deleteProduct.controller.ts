import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier'; // Importante para el blindaje
import { DeleteProductUseCase } from '../../../../../contexts/product/useCases/deleteProduct.useCase';

export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const userIdSession = req.userSession!.id;

      const deletedProduct = await this.deleteProductUseCase.execute(
        id,
        userIdSession,
      );

      res.status(200).json({
        message: 'Producto eliminado con éxito.',
        data: deletedProduct, 
      });
    } catch (error: any) {

      if (error.message.includes('no encontrado')) {
        res.status(404).json({ message: error.message });
        return;
      }


      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }


      console.error('[DeleteProductController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
