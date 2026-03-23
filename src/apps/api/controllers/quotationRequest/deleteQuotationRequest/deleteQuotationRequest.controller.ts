import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { DeleteQuotationRequestUseCase } from '../../../../../contexts/quotationRequest/useCases/deleteQuotationRequest.useCase';

export class DeleteQuotationRequestController {
  constructor(
    private deleteQuotationRequestUseCase: DeleteQuotationRequestUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userSession = req.userSession!;

      const deletedRequest = await this.deleteQuotationRequestUseCase.execute(
        id,
        userSession,
      );

      res.status(200).json({
        message: 'Solicitud de cotización eliminada exitosamente',
        data: deletedRequest,
      });
    } catch (error: any) {
      const errorMessage = error.message.toLowerCase();


      if (errorMessage.includes('no tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }


      if (errorMessage.includes('no existe')) {
        res.status(404).json({ message: error.message });
        return;
      }


      console.error('[DeleteQuotationRequestController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
