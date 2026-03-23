import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetProductUseCase } from '../../../../../contexts/product/useCases/getProduct.useCase';

export class GetProductController {
  constructor(private getProductUseCase: GetProductUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const userIdSession = req.userSession!.id;

      const product = await this.getProductUseCase.execute(id, userIdSession);

      res.status(200).json({
        message: 'Producto obtenido con éxito',
        data: product,
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


      console.error('[GetProductController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
