import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { RegisterQuotationRequestUseCase } from '../../../../../contexts/quotationRequest/useCases/registerQuotationRequest.useCase';

export class CreateQuotationRequestController {
  constructor(
    private registerQuotationRequestUseCase: RegisterQuotationRequestUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userSession = req.userSession!;

      const result = await this.registerQuotationRequestUseCase.execute(
        req.body,
        userSession,
      );

      res.status(201).json({
        message: 'Solicitud de cotización creada exitosamente.',
        data: result,
      });
    } catch (error: any) {
      const errorMessage = error.message.toLowerCase();


      if (errorMessage.includes('límite') || errorMessage.includes('limite')) {
        res.status(403).json({
          message: error.message,
          error: 'PLAN_LIMIT_REACHED',
        });
        return;
      }


      if (
        errorMessage.includes('no encontrado') ||
        errorMessage.includes('no existe')
      ) {
        res.status(404).json({ message: error.message });
        return;
      }


      if (
        errorMessage.includes('determinar') ||
        errorMessage.includes('asignado')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }

      console.error('[CreateQuotationRequestController] Error:', error);
      res.status(500).json({
        message: 'Error interno del servidor al procesar la solicitud.',
      });
    }
  }
}
