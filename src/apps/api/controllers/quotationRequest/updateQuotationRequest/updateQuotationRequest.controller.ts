import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { UpdateQuotationRequestUseCase } from '../../../../../contexts/quotationRequest/useCases/updateQuotationRequest.useCase';

export class UpdateQuotationRequestController {
  constructor(
    private updateQuotationRequestUseCase: UpdateQuotationRequestUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userSession = req.userSession!;

      // El Caso de Uso ya se encarga de filtrar campos y validar propiedad
      const updatedRequest = await this.updateQuotationRequestUseCase.execute(
        id,
        userSession,
        req.body,
      );

      res.status(200).json({
        message: 'Solicitud de cotización actualizada exitosamente.',
        data: updatedRequest,
      });
    } catch (error: any) {
      const errorMessage = error.message.toLowerCase();

      // 1. Blindaje de propiedad y existencia (403/404)
      if (
        errorMessage.includes('no tienes permiso') ||
        errorMessage.includes('no existe')
      ) {
        // Usamos 404 para no dar pistas sobre IDs existentes de otros usuarios
        res.status(404).json({ message: error.message });
        return;
      }

      // 2. Errores de lógica (400)
      if (errorMessage.includes('no se detectaron cambios')) {
        res.status(400).json({ message: error.message });
        return;
      }

      console.error('[UpdateQuotationRequestController] Error:', error);
      res.status(500).json({
        message: 'Error interno del servidor al actualizar la solicitud.',
      });
    }
  }
}
