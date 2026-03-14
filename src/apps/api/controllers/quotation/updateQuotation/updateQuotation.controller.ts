import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { UpdateQuotationUseCase } from '../../../../../contexts/quotation/useCases/updateQuotation.useCase';

export class UpdateQuotationController {
  constructor(private updateQuotationUseCase: UpdateQuotationUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userSession = req.userSession!;

      // Mapeamos el body a objetos Date donde sea necesario para el DTO
      const updateData = {
        ...req.body,
        responseDeadline: req.body.responseDeadline
          ? new Date(req.body.responseDeadline)
          : undefined,
        deliveryTime: req.body.deliveryTime
          ? new Date(req.body.deliveryTime)
          : undefined,
      };

      const updatedQuotation = await this.updateQuotationUseCase.execute(
        id,
        userSession,
        updateData,
      );

      res.status(200).json({
        message: 'Cotización actualizada exitosamente',
        data: updatedQuotation,
      });
    } catch (error: any) {
      const message = error.message;

      // 1. Error de Seguridad - Forbidden (403)
      if (message.includes('No tienes permiso')) {
        res.status(403).json({ message });
        return;
      }

      // 2. No existe (404)
      if (message.includes('no existe')) {
        res.status(404).json({ message });
        return;
      }

      // 3. Sin cambios detectados (400)
      if (message.includes('No se detectaron cambios')) {
        res.status(400).json({ message });
        return;
      }

      console.error('[UpdateQuotationController] Error:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
