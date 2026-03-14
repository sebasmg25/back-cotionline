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
    // 1. Concatenamos (unimos) los valores en el orden exacto:
    // Referencia + Monto en centavos + Moneda + Secreto de integridad
    const rawChain = `${reference}${amountInCents}${currency}${integritySecret}`;

    // 2. Aplicamos el algoritmo SHA-256
    // .createHash('sha256'): Define el algoritmo.
    // .update(rawChain): Le pasa el texto que queremos proteger.
    // .digest('hex'): Nos devuelve el resultado en formato legible (hexadecimal).
    return crypto.createHash('sha256').update(rawChain).digest('hex');
  }

  static validateEventChecksum(
    data: any,
    timestamp: number,
    enviromentSecret: string,
    receivedChecksum: string,
  ): boolean {
    // El orden de Wompi para eventos es:
    // id_transaccion + status + amount_in_cents + timestamp + secreto_eventos
    const { id, status, amount_in_cents } = data.transaction;

    const rawChain = `${id}${status}${amount_in_cents}${timestamp}${enviromentSecret}`;

    const generatedChecksum = crypto
      .createHash('sha256')
      .update(rawChain)
      .digest('hex');

    console.log(generatedChecksum, 'CHECKSUMMM');

    return generatedChecksum === receivedChecksum;
  }
}
