import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { DeleteQuotationUseCase } from '../../../../../contexts/quotation/useCases/deleteQuotation.useCase';

export class DeleteQuotationController {
  constructor(private deleteQuotationUseCase: DeleteQuotationUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const userSession = req.userSession!;

      const deletedQuotation = await this.deleteQuotationUseCase.execute(
        id,
        userSession,
      );

      res.status(200).json({
        message: 'Cotización eliminada con éxito.',
        data: deletedQuotation, // Devolvemos la data para que el Front sepa qué se borró
      });
    } catch (error: any) {
      const message = error.message;

      // 1. Error de Seguridad - Forbidden (403)
      if (message.includes('No tienes permiso')) {
        res.status(403).json({ message });
        return;
      }

      // 2. No encontrado (404)
      if (message.includes('no encontrada')) {
        res.status(404).json({ message });
        return;
      }

      // 3. Error técnico inesperado (500)
      console.error('[DeleteQuotationController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
