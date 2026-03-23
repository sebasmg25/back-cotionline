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


      if (
        errorMessage.includes('no tienes permiso') ||
        errorMessage.includes('no existe')
      ) {
        
        res.status(404).json({ message: error.message });
        return;
      }


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
