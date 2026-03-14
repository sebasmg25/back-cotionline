import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { QuotationRequestEntity } from '../../../../../quotationRequest/infraestructure/persistance/typeorm/entities/quotationRequest.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  amount!: number;

  @Column()
  unitOfMeasurement!: string;

  @Column()
  description!: string;

  @Column()
  quotationRequestId!: string;

  @ManyToOne(
    () => QuotationRequestEntity,
    (quotationRequest) => quotationRequest.products,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'quotationRequestId' })
  quotationRequest!: QuotationRequestEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
