import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetAllQuotationRequestsByUserIdUseCase } from '../../../../../contexts/quotationRequest/useCases/getAllQuotationRequestsByUserId.useCase';

export class GetAllQuotationRequestsByUserIdController {
  constructor(
    private getAllQuotationRequestsByUserIdUseCase: GetAllQuotationRequestsByUserIdUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userSession = req.userSession!;

      const quotationRequests =
        await this.getAllQuotationRequestsByUserIdUseCase.execute(
          userSession,
        );

      res.status(200).json({
        message: 'Lista de tus solicitudes obtenida con éxito.',
        data: quotationRequests,
      });
    } catch (error: any) {
      console.error(
        '[GetAllQuotationRequestsByUserIdController] Error:',
        error,
      );

      res.status(500).json({
        message:
          'Error interno del servidor al obtener el historial de solicitudes.',
      });
    }
  }
}
