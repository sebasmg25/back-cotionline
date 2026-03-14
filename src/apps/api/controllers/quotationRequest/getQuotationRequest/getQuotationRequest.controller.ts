import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetQuotationRequestUseCase } from '../../../../../contexts/quotationRequest/useCases/getQuotationRequest.useCase';

export class GetQuotationRequestController {
  constructor(private getQuotationRequestUseCase: GetQuotationRequestUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userSession = req.userSession!;

      const quotationRequest = await this.getQuotationRequestUseCase.execute(
        id,
        userSession,
      );

      res.status(200).json({
        message: 'Solicitud de Cotización obtenida con éxito.',
        data: quotationRequest,
      });
    } catch (error: any) {

      if (error.message.includes('permiso')) {
  res.status(403).json({ message: error.message });
  return;
}
      // 1. Manejo de existencia/propiedad (404)
      if (error.message.toLowerCase().includes('no encontrada')) {
        res.status(404).json({ message: error.message });
        return;
      }

      // 2. Error técnico
      console.error('[GetQuotationRequestController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
