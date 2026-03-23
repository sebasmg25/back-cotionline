import { Request, Response } from 'express';
import { UpdatePaymentStatusUseCase } from '../../../../../contexts/subscription/useCases/updatePaymentStatus.useCase';
import { WompiSignatureService } from '../../../../../contexts/shared/infraestructure/payment/wompiSignature.service';
import { EnvConfig } from '../../../../../contexts/shared/infraestructure/env/envConfig';

export class WompiWebhookController {
  constructor(private updatePaymentStatusUseCase: UpdatePaymentStatusUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { data, timestamp, signature } = req.body;


      const isValid = WompiSignatureService.validateEventChecksum(
        data,
        timestamp,
        EnvConfig.get('WOMPI_EVENTS_SECRET'),
        signature?.checksum, 
      );

      if (!isValid) {
        console.error('[WompiWebhook] Intento de acceso no autorizado.');
        res.status(401).send('Unauthorized');
        return;
      }


      const transactionData = data?.transaction;
      if (!transactionData) {
        res.status(400).send('Invalid payload');
        return;
      }

      const { reference, status, id: wompiId } = transactionData;


      await this.updatePaymentStatusUseCase.execute(reference, status, wompiId);


      res.status(200).send('OK');
    } catch (error: any) {
      const errorMessage = error.message.toLowerCase();
      const safeErrorMsg = errorMessage.replaceAll(/[\r\n]/g, '');
      console.error('[WompiWebhook] Error:', safeErrorMsg);

      if (errorMessage.includes('no encontrada')) {
        res.status(404).send('Transacción no encontrada.');
        return;
      }

      res.status(200).send('Error handled');
    }
  }
}
