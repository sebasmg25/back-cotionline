import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../user/infrastructure/persistance/typeorm/entities/user.entity';

@Entity('quotation_requests')
export class QuotationRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  createdAt!: Date;

  @Column()
  responseDeadline!: Date;

  @Column()
  status!: string;

  @Column()
  branch!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.quotationRequests)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
