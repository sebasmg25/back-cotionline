import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetAllQuotationsByUserIdUseCase } from '../../../../../contexts/quotation/useCases/getAllQuotationsByUserId.useCase';

export class GetAllQuotationsByUserIdController {
  constructor(
    private getAllQuotationsByUserIdUseCase: GetAllQuotationsByUserIdUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userSession = req.userSession!;

      const quotations = await this.getAllQuotationsByUserIdUseCase.execute(
        userSession,
      );

      res.status(200).json({
        message: 'Historial de cotizaciones obtenido con éxito',
        data: quotations,
      });
    } catch (error: any) {
      console.error('[GetAllQuotationsByUserIdController] Error:', error);
      res.status(500).json({
        message: 'Error interno del servidor al obtener el historial de cotizaciones.',
      });
    }
  }
}
