import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetQuotationsByRequestUseCase } from '../../../../../contexts/quotation/useCases/getQuotationsByRequest.useCase';

export class GetQuotationsByRequestController {
  constructor(
    private getQuotationsByRequestUseCase: GetQuotationsByRequestUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quotationRequestId } = req.params;

      const userSession = req.userSession!;

      const quotations = await this.getQuotationsByRequestUseCase.execute(
        quotationRequestId,
        userSession,
      );

      res.status(200).json({
        message: 'Lista de cotizaciones obtenida con éxito',
        data: quotations,
      });
    } catch (error: any) {
      const message = error.message;

      if (message.includes('No tienes permiso')) {
        res.status(403).json({ message });
        return;
      }


      if (
        message.toLowerCase().includes('no encontrada') ||
        message.toLowerCase().includes('no existe')
      ) {
        res.status(404).json({ message });
        return;
      }


      console.error('[GetQuotationsByRequestController] Error:', error);
      res.status(500).json({
        message: 'Error interno del servidor al obtener las cotizaciones.',
      });
    }
  }
}
