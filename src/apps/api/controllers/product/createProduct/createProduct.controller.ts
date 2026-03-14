import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { CreateProductUseCase } from '../../../../../contexts/product/useCases/createProduct.useCase';

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quotationRequestId } = req.params;
      const userIdSession = req.userSession!.id;

      const savedProduct = await this.createProductUseCase.execute(
        { ...req.body, quotationRequestId },
        userIdSession,
      );

      res.status(201).json({
        message: 'Producto creado exitosamente',
        data: savedProduct,
      });
    } catch (error: any) {
      if (error.message.includes('Ya existe un producto')) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (
        error.message.includes('No tienes permiso') ||
        error.message.includes('No se pudo encontrar')
      ) {
        res.status(403).json({ message: error.message });
        return;
      }
      if (error.message.includes('no existe')) {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('[CreateProductController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
