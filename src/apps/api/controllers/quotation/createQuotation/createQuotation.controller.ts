import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { CreateQuotationUseCase } from '../../../../../contexts/quotation/useCases/createQuotation.useCase';

export class CreateQuotationController {
  constructor(private createQuotationUseCase: CreateQuotationUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quotationRequestId } = req.params;
      const userSession = req.userSession!;

      const savedQuotation = await this.createQuotationUseCase.execute(
        { ...req.body, quotationRequestId },
        userSession,
      );

      res.status(201).json({
        message: 'Cotización enviada exitosamente y cliente notificado.',
        data: savedQuotation,
      });
    } catch (error: any) {
      const message = error.message;


      if (message.includes('límite')) {
        res.status(403).json({
          message,
          code: 'SUBSCRIPTION_LIMIT_REACHED',
        });
        return;
      }


      if (message.includes('ya ha enviado')) {
        res.status(409).json({ message });
        return;
      }


      if (message.includes('no existe') || message.includes('no encontrado')) {
        res.status(404).json({ message });
        return;
      }


      if (message.includes('asignado') || message.includes('determinar')) {
        res.status(400).json({ message });
        return;
      }

      console.error('[CreateQuotationController] Error:', error);
      res
        .status(500)
        .json({ message: 'Error interno al procesar la cotización.' });
    }
  }
}
