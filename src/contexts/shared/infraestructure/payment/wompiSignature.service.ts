import * as crypto from 'crypto';

export class WompiSignatureService {
  /**
   * Genera la firma de integridad para Wompi.
   * La documentación de Wompi exige un orden específico para que el Hash sea válido.
   */
  static generateIntegritySignature(
    reference: string,
    amountInCents: number,
    currency: string,
    integritySecret: string,
  ): string {
    const rawChain = `${reference}${amountInCents}${currency}${integritySecret}`;

    return crypto.createHash('sha256').update(rawChain).digest('hex');
  }

  static validateEventChecksum(
    data: any,
    timestamp: number,
    enviromentSecret: string,
    receivedChecksum: string,
  ): boolean {
    const { id, status, amount_in_cents } = data.transaction;

    const rawChain = `${id}${status}${amount_in_cents}${timestamp}${enviromentSecret}`;

    const generatedChecksum = crypto
      .createHash('sha256')
      .update(rawChain)
      .digest('hex');

    return generatedChecksum === receivedChecksum;
  }
}
