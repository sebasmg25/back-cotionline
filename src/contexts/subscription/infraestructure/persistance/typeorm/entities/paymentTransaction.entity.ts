import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../user/infraestructure/persistance/typeorm/entities/user.entity';
import { PlanEntity } from './plan.entity';

@Entity('payment_transactions')
export class PaymentTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  planId!: string;

  @Column({ type: 'int' })
  amount!: number;

  @Column({ default: 'PENDIENTE' })
  status!: string;

  @Column({ nullable: true })
  wompiId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => PlanEntity)
  @JoinColumn({ name: 'planId' })
  plan!: PlanEntity;
}
