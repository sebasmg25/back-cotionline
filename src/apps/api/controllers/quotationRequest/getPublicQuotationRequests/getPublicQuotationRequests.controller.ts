import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetPublicQuotationRequestsUseCase } from '../../../../../contexts/quotationRequest/useCases/getPublicQuotationRequests.useCase';

export class GetPublicQuotationRequestsController {
  constructor(
    private getPublicQuotationRequestsUseCase: GetPublicQuotationRequestsUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userSession = req.userSession!;

      const { department, city } = req.query as {
        department?: string;
        city?: string;
      };

      const requests = await this.getPublicQuotationRequestsUseCase.execute(
        userSession,
        { department, city },
      );

      res.status(200).json({
        message: 'Solicitudes públicas obtenidas con éxito.',
        data: requests,
      });
    } catch (error: any) {
      console.error('[GetPublicQuotationRequestsController] Error:', error);

      res.status(500).json({
        message:
          'Error interno del servidor al obtener la cartelera de solicitudes.',
      });
    }
  }
}
