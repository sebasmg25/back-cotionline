import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/jwtVerifier';
import { InitializePaymentUseCase } from '../../../../../contexts/subscription/useCases/initializePayment.useCase';

export class InitializePaymentController {
  constructor(private initializePaymentUseCase: InitializePaymentUseCase) {}

  async handle(req: AuthRequest, res: Response): Promise<void> {
    try {

      const userIdSession = req.userSession!.id;
      const { planId } = req.body;


      if (!planId) {
        res.status(400).json({
          message: 'El ID del plan es requerido para inicializar el pago.',
        });
        return;
      }

      const paymentData = await this.initializePaymentUseCase.execute(
        userIdSession,
        planId,
      );

      res.status(200).json({
        message: 'Pago inicializado con éxito.',
        data: paymentData,
      });
    } catch (error: any) {
      const errorMessage = error.message.toLowerCase();


      if (errorMessage.includes('no existe')) {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('[InitializePaymentController] Error:', error);
      res.status(500).json({
        message: 'Error interno al procesar la solicitud de pago.',
      });
    }
  }
}
