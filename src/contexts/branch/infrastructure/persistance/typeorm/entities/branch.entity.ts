import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BusinessEntity } from '../../../../../business/infraestructure/persistance/typeorm/entities/business.entity';

@Entity('branches')
export class BranchEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  businessId!: string;

  @ManyToOne(() => BusinessEntity, (business) => business.branches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'businessId' })
  business!: BusinessEntity;
}
