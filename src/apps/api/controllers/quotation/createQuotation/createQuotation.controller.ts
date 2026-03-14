import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { CreateQuotationUseCase } from '../../../../../contexts/quotation/useCases/createQuotation.useCase';

export class CreateQuotationController {
  constructor(private createQuotationUseCase: CreateQuotationUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quotationRequestId } = req.params;
      const userSession = req.userSession!;

      // Unificamos el ID de la URL con el body para cumplir con el DTO
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

      // 1. Límites de Plan (403)
      if (message.includes('límite')) {
        res.status(403).json({
          message,
          code: 'SUBSCRIPTION_LIMIT_REACHED',
        });
        return;
      }

      // 2. Duplicidad (409)
      if (message.includes('ya ha enviado')) {
        res.status(409).json({ message });
        return;
      }

      // 3. Recursos no encontrados (404)
      if (message.includes('no existe') || message.includes('no encontrado')) {
        res.status(404).json({ message });
        return;
      }

      // 4. Errores de configuración de usuario/plan (400)
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
