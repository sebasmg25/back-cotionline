import { PaymentTransaction } from '../models/paymentTransaction.model';

export interface PaymentTransactionRepository {
  save(transaction: PaymentTransaction): Promise<PaymentTransaction>;
  findById(id: string): Promise<PaymentTransaction | null>;
  updateStatus(id: string, status: string, wompiId?: string): Promise<void>;
}
