import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../user/infrastructure/persistance/typeorm/entities/user.entity';

@Entity('business')
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

  @ManyToOne(() => UserEntity, (user) => user.businesses)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
