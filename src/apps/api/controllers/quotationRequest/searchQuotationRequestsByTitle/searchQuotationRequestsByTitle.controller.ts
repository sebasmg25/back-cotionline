import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { SearchQuotationRequestsByTitleUseCase } from '../../../../../contexts/quotationRequest/useCases/searchQuotationRequestsByTitle.useCase';

export class SearchQuotationRequestsByTitleController {
  constructor(
    private searchQuotationRequestsByTitleUseCase: SearchQuotationRequestsByTitleUseCase,
  ) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const title = req.query.title as string;
      const userSession = req.userSession!;

      const results = await this.searchQuotationRequestsByTitleUseCase.execute(
        title,
        userSession,
      );

      res.status(200).json({
        message: `Resultados de búsqueda obtenidos con éxito.`,
        data: results,
      });
    } catch (error: any) {
      console.error('[SearchQuotationRequestsByTitleController] Error:', error);

      res.status(500).json({
        message: 'Error interno al realizar la búsqueda de solicitudes.',
      });
    }
  }
}
