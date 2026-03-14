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
      // 1. Error de permisos (403) - Intento de espionaje o acceso no autorizado
      if (error.message.includes('No tienes permiso')) {
        res.status(403).json({ message: error.message });
        return;
      }

      // 2. Error de negocio: No hay datos para comparar (404)
      if (
        error.message.includes('No hay cotizaciones') ||
        error.message.includes('no existe')
      ) {
        res.status(404).json({ message: error.message });
        return;
      }

      // 3. Error técnico inesperado
      console.error('[CompareQuotationsController] Error:', error);
      res.status(500).json({
        message: 'Error interno al procesar la comparación',
      });
    }
  }
}
