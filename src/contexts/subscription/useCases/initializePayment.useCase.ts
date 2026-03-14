import { v4 as uuidv4 } from 'uuid';
import { PlanRepository } from '../domain/repositories/plan.repository';
import { PaymentTransactionRepository } from '../domain/repositories/paymentTransaction.repository';
import {
  PaymentTransaction,
  PaymentStatus,
} from '../domain/models/paymentTransaction.model';
import { WompiSignatureService } from '../../shared/infraestructure/payment/wompiSignature.service';
import { EnvConfig } from '../../shared/infraestructure/env/envConfig';
import { PaymentInitializationResponse } from '../interfaces/dtos/subscription.dto';

export class InitializePaymentUseCase {
  constructor(
    private planRepository: PlanRepository,
    private transactionRepository: PaymentTransactionRepository,
  ) {}

  async execute(
    userId: string,
    planId: string,
  ): Promise<PaymentInitializationResponse> {
    // 1. Validar existencia del plan
    const plan = await this.planRepository.findById(planId);
    if (!plan) {
      throw new Error('El plan seleccionado no existe.');
    }

    // 2. Preparar datos técnicos
    const transactionId = uuidv4();
    const amountInCents = plan.price * 100;
    const currency = 'COP';
    const integritySecret = EnvConfig.get('WOMPI_INTEGRITY_SECRET');

    // 3. Generar firma de seguridad (Blindaje contra manipulación de montos)
    const signature = WompiSignatureService.generateIntegritySignature(
      transactionId,
      amountInCents,
      currency,
      integritySecret,
    );

    // 4. Persistir intención de pago
    const newTransaction = new PaymentTransaction(
      transactionId,
      userId,
      plan.id,
      plan.price,
      PaymentStatus.PENDING,
    );

    await this.transactionRepository.save(newTransaction);

    // 5. Retornar DTO exacto para el Widget
    return {
      reference: transactionId,
      amountInCents,
      currency,
      signature,
      publicKey: EnvConfig.get('WOMPI_PUBLIC_KEY'),
    };
  }
}
