import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetProductsByQuotationRequestIdUseCase } from '../../../../../contexts/product/useCases/getProductsByQuotationRequestId.useCase';

export class GetProductsByQuotationRequestIdController {
  constructor(
    private getProductsUseCase: GetProductsByQuotationRequestIdUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quotationRequestId } = req.params;
      const userIdSession = req.userSession!.id;

      const products = await this.getProductsUseCase.execute(
        quotationRequestId,
        userIdSession,
      );

      res.status(200).json({
        data: products,
      });
    } catch (error: any) {
      // 1. Error de permisos (403)
      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }

      // 2. No encontrado (404)
      if (error.message.includes('no existe')) {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('[GetProductsByQuotationController] Error:', error);
      res
        .status(500)
        .json({ message: 'Error interno al obtener los productos.' });
    }
  }
}
