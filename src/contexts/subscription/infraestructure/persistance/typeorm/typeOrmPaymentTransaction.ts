import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { PaymentTransactionEntity } from './entities/paymentTransaction.entity';
import {
  PaymentTransaction,
  PaymentStatus,
} from '../../../domain/models/paymentTransaction.model';
import { PaymentTransactionRepository } from '../../../domain/repositories/paymentTransaction.repository';

export class TypeORMPaymentTransactionRepository implements PaymentTransactionRepository {
  private ormRepository: Repository<PaymentTransactionEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(PaymentTransactionEntity);
  }

  private mapToDomain(entity: PaymentTransactionEntity): PaymentTransaction {
    return new PaymentTransaction(
      entity.id,
      entity.userId,
      entity.planId,
      entity.amount,
      entity.status as PaymentStatus,
      entity.wompiId ?? undefined,
      entity.createdAt,
    );
  }

  async save(transaction: PaymentTransaction): Promise<PaymentTransaction> {
    const entityToSave = this.ormRepository.create({ ...transaction });
    const savedEntity = await this.ormRepository.save(entityToSave);
    return this.mapToDomain(savedEntity);
  }

  async findById(id: string): Promise<PaymentTransaction | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
    wompiId?: string,
  ): Promise<void> {
    const updateData: Partial<PaymentTransactionEntity> = { status };
    if (wompiId) updateData.wompiId = wompiId;

    await this.ormRepository.update(id, updateData);
  }
}
