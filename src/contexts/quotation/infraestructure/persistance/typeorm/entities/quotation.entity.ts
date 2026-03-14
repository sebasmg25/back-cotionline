import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { QuotationRequestEntity } from '../../../../../quotationRequest/infraestructure/persistance/typeorm/entities/quotationRequest.entity';
import { UserEntity } from '../../../../../user/infraestructure/persistance/typeorm/entities/user.entity';
import { QuotationStatus } from '../../../../domain/models/quotation.model';

@Entity('quotations')
@Index(['userId', 'quotationRequestId'], { unique: true })
export class QuotationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  issueDate!: Date;

  @Column()
  responseDeadline!: Date;

  @Column()
  price!: number;

  @Column()
  deliveryTime!: Date;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: ['DRAFT', 'PENDING', 'ACCEPTED', 'EXPIRED'],
    default: 'DRAFT',
  })
  status!: QuotationStatus;

  @Column({ type: 'json', nullable: true })
  individualValues?: any[];

  @Column()
  quotationRequestId!: string;

  @Column()
  userId!: string;

  @ManyToOne(
    () => QuotationRequestEntity,
    (quotationRequest) => quotationRequest.quotations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'quotationRequestId' })
  quotationRequest!: QuotationRequestEntity;

  @ManyToOne(() => UserEntity, (user) => user.quotations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
