import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { GetQuotationUseCase } from '../../../../../contexts/quotation/useCases/getQuotation.useCase';

export class GetQuotationController {
  constructor(private getQuotationUseCase: GetQuotationUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userSession = req.userSession!;

      // El caso de uso ahora exige el contexto de sesión para el blindaje dual
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

      // 1. Error de Seguridad - Forbidden (403)
      // Si el usuario no es ni el proveedor ni el comprador de la solicitud
      if (message.includes('No tienes permiso')) {
        res.status(403).json({ message });
        return;
      }

      // 2. No encontrado (404)
      if (message.toLowerCase().includes('no encontrada')) {
        res.status(404).json({ message });
        return;
      }

      // 3. Error técnico inesperado
      console.error('[GetQuotationController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
