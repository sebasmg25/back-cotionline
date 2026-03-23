import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { CompareQuotationsUseCase } from '../../../../../contexts/quotation/useCases/compareQuotations.useCase';

export class CompareQuotationsController {
  constructor(private compareQuotationsUseCase: CompareQuotationsUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quotationRequestId } = req.params;

      const userSession = req.userSession!;

      const result = await this.compareQuotationsUseCase.execute(
        quotationRequestId,
        userSession,
      );

      res.status(200).json({
        message: 'Comparación de cotizaciones realizada con éxito',
        data: result,
      });
    } catch (error: any) {

      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }


      if (
        error.message.includes('No hay cotizaciones') ||
        error.message.includes('no existe')
      ) {
        res.status(404).json({ message: error.message });
        return;
      }


      console.error('[CompareQuotationsController] Error:', error);
      res.status(500).json({
        message: 'Error interno al procesar la comparación',
      });
    }
  }
}
