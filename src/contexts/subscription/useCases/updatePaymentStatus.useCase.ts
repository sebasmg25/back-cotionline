import {
  PaymentTransaction,
  PaymentStatus,
} from '../domain/models/paymentTransaction.model';
import { PaymentTransactionRepository } from '../domain/repositories/paymentTransaction.repository';
import { UserRepository } from '../../user/domain/repositories/user.repository';

export class UpdatePaymentStatusUseCase {
  constructor(
    private transactionRepository: PaymentTransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(
    transactionId: string,
    status: string,
    wompiId?: string,
  ): Promise<void> {
    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new Error(
        `Transacción con referencia ${transactionId} no encontrada.`,
      );
    }

    const safeTxId = transactionId.replaceAll(/[\r\n]/g, '');

    // Blindaje de Idempotencia: Si ya no está pendiente, ignoramos el proceso para no duplicar acciones.
    if (transaction.status !== PaymentStatus.PENDING) {
      console.log(
        `[Payment] La transacción ${safeTxId} ya fue procesada anteriormente.`,
      );
      return;
    }

    const normalizedStatus = status.toUpperCase();

    if (normalizedStatus === 'APPROVED') {
      // 1. Actualizar estado de la transacción
      await this.transactionRepository.updateStatus(
        transactionId,
        PaymentStatus.APPROVED,
        wompiId,
      );

      // 2. Activar el plan en el usuario
      // Importante: userRepository.updatePlan debe setear la fecha de inicio a "ahora"
      await this.userRepository.updatePlan(
        transaction.userId,
        transaction.planId,
      );

      console.log(
        `✨ [Subscription] ¡Éxito! Usuario ${transaction.userId} ahora tiene el plan ${transaction.planId}`,
      );
    } else {
      // Manejo de rechazos, errores o cancelaciones
      const newStatus =
        normalizedStatus === 'DECLINED'
          ? PaymentStatus.DECLINED
          : PaymentStatus.ERROR;

      await this.transactionRepository.updateStatus(transactionId, newStatus);

      const safeNormalizedStatus = normalizedStatus.replaceAll(/[\r\n]/g, '');
      console.log(
        `❌ [Payment] Transacción ${safeTxId} terminó con estado: ${safeNormalizedStatus}`,
      );
    }
  }
}
