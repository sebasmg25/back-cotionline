import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { CloseQuotationRequestUseCase } from '../../../../../contexts/quotationRequest/useCases/closeQuotationRequest.useCase';

export class CloseQuotationRequestController {
  constructor(
    private closeQuotationRequestUseCase: CloseQuotationRequestUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { selectedOfferId } = req.body;
      const userIdSession = req.userSession!.id;

      await this.closeQuotationRequestUseCase.execute(
        id,
        userIdSession,
        selectedOfferId,
      );

      res.status(200).json({
        message:
          'Solicitud de cotización cerrada y proveedor notificado exitosamente.',
      });
    } catch (error: any) {
      const errorMessage = error.message.toLowerCase();


      if (errorMessage.includes('no tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }


      if (
        errorMessage.includes('no encontrada') ||
        errorMessage.includes('no existe')
      ) {
        res.status(404).json({ message: error.message });
        return;
      }


      if (
        errorMessage.includes('expirado') ||
        errorMessage.includes('cerrada') ||
        errorMessage.includes('pertenece')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }


      console.error('[CloseQuotationRequestController] Error:', error);
      res.status(500).json({
        message: 'Error interno al procesar el cierre de la solicitud.',
      });
    }
  }
}
