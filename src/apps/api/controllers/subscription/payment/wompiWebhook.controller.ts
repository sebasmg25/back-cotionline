import { Request, Response } from 'express';
import { UpdatePaymentStatusUseCase } from '../../../../../contexts/subscription/useCases/updatePaymentStatus.useCase';
import { WompiSignatureService } from '../../../../../contexts/shared/infraestructure/payment/wompiSignature.service';
import { EnvConfig } from '../../../../../contexts/shared/infraestructure/env/envConfig';

export class WompiWebhookController {
  constructor(private updatePaymentStatusUseCase: UpdatePaymentStatusUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { data, timestamp, signature } = req.body;

      // 1. BLINDAJE DE SEGURIDAD: Validar que la petición realmente venga de Wompi
      const isValid = WompiSignatureService.validateEventChecksum(
        data,
        timestamp,
        EnvConfig.get('WOMPI_EVENTS_SECRET'),
        signature?.checksum, // Usamos optional chaining por si el payload viene roto
      );

      if (!isValid) {
        console.error('[WompiWebhook] Intento de acceso no autorizado.');
        res.status(401).send('Unauthorized');
        return;
      }

      // 2. Extracción de datos (Wompi anida todo en data.transaction)
      const transactionData = data?.transaction;
      if (!transactionData) {
        res.status(400).send('Invalid payload');
        return;
      }

      const { reference, status, id: wompiId } = transactionData;

      // 3. Ejecución de la lógica de negocio (Idempotencia y Activación de Plan)
      await this.updatePaymentStatusUseCase.execute(reference, status, wompiId);

      // 4. Respuesta de confirmación (Obligatoria para que Wompi deje de reintentar)
      res.status(200).send('OK');
    } catch (error: any) {
      const errorMessage = error.message.toLowerCase();
      const safeErrorMsg = errorMessage.replaceAll(/[\r\n]/g, '');
      console.error('[WompiWebhook] Error:', safeErrorMsg);

      // Si la transacción no existe, enviamos 404 para que Wompi lo registre en sus logs,
      // pero usualmente devolvemos 200 si queremos evitar reintentos infinitos por errores lógicos.
      if (errorMessage.includes('no encontrada')) {
        res.status(404).send('Transacción no encontrada.');
        return;
      }

      res.status(200).send('Error handled');
    }
  }
}
