import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetQuotationUseCase } from '../../../../../contexts/quotation/useCases/getQuotation.useCase';

export class GetQuotationController {
  constructor(private getQuotationUseCase: GetQuotationUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userSession = req.userSession!;

      const quotation = await this.getQuotationUseCase.execute(
        id,
        userSession,
      );

      res.status(200).json({
        message: 'Cotización obtenida con éxito',
        data: quotation,
      });
    } catch (error: any) {
      const message = error.message;

      if (message.includes('No tienes permiso')) {
        res.status(403).json({ message });
        return;
      }


      if (message.toLowerCase().includes('no encontrada')) {
        res.status(404).json({ message });
        return;
      }


      console.error('[GetQuotationController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
