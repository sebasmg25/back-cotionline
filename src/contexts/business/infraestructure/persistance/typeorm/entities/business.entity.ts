import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../user/infraestructure/persistance/typeorm/entities/user.entity';
import { BranchEntity } from '../../../../../branch/infrastructure/persistance/typeorm/entities/branch.entity';
import { BusinessStatus } from '../../../../domain/models/business.model';

@Entity('businesses')
export class BusinessEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  nit!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  address!: string;

  @Column()
  userId!: string;

  @Column({
    type: 'enum',
    enum: BusinessStatus,
    default: BusinessStatus.PENDING,
  })
  status!: BusinessStatus;

  @Column({ nullable: true })
  rutUrl!: string;

  @Column({ nullable: true })
  chamberOfCommerceUrl!: string;

  @OneToMany(() => BranchEntity, (branch) => branch.business)
  branches!: BranchEntity[];

  @ManyToOne(() => UserEntity, (user) => user.businesses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
