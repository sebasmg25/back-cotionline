import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../user/infraestructure/persistance/typeorm/entities/user.entity';
import { ProductEntity } from '../../../../../product/infraestructure/persistance/typeorm/entities/product.entity';
import { QuotationEntity } from '../../../../../quotation/infraestructure/persistance/typeorm/entities/quotation.entity';
import { QuotationRequestStatus } from '../../../../domain/models/quotationRequest.model';

@Entity('quotation_requests')
export class QuotationRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;
  
  @Column()
  description!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @Column()
  responseDeadline!: Date;

  @Column({
    type: 'enum',
    enum: QuotationRequestStatus,
    default: QuotationRequestStatus.PENDING,
  })
  status!: QuotationRequestStatus;

  @Column()
  branch!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.quotationRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  // RELACIÓN: Una solicitud tiene muchos Productos
  @OneToMany(() => ProductEntity, (product) => product.quotationRequest)
  products!: ProductEntity[];

  @OneToMany(() => QuotationEntity, (quotation) => quotation.quotationRequest)
  quotations!: QuotationEntity[];
}
