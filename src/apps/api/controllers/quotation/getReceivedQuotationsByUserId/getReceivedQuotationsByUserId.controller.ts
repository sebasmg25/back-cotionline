import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetReceivedQuotationsByUserIdUseCase } from '../../../../../contexts/quotation/useCases/getReceivedQuotationsByUserId.useCase';

export class GetReceivedQuotationsByUserIdController {
  constructor(
    private getReceivedQuotationsByUserIdUseCase: GetReceivedQuotationsByUserIdUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userSession = req.userSession!;

      const quotations = await this.getReceivedQuotationsByUserIdUseCase.execute(
        userSession,
      );

      res.status(200).json({
        message: 'Cotizaciones recibidas obtenidas con éxito',
        data: quotations,
      });
    } catch (error: any) {
      console.error('[GetReceivedQuotationsByUserIdController] Error:', error);
      res.status(500).json({
        message: 'Error interno del servidor al obtener las cotizaciones recibidas.',
      });
    }
  }
}
