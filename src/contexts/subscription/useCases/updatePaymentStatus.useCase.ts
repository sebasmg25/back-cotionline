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

    if (transaction.status !== PaymentStatus.PENDING) {

      return;
    }

    const normalizedStatus = status.toUpperCase();

    if (normalizedStatus === 'APPROVED') {
      await this.transactionRepository.updateStatus(
        transactionId,
        PaymentStatus.APPROVED,
        wompiId,
      );

      await this.userRepository.updatePlan(
        transaction.userId,
        transaction.planId,
      );

      } else {
      const newStatus =
        normalizedStatus === 'DECLINED'
          ? PaymentStatus.DECLINED
          : PaymentStatus.ERROR;

      await this.transactionRepository.updateStatus(transactionId, newStatus);

      const safeNormalizedStatus = normalizedStatus.replaceAll(/[\r\n]/g, '');

    }
  }
}
