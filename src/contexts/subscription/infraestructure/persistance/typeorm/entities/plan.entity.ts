import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserEntity } from '../../../../../user/infraestructure/persistance/typeorm/entities/user.entity';

@Entity('plans')
export class PlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int' })
  requestLimit!: number;

  @Column({ type: 'int' })
  quotationLimit!: number;

  @Column({ type: 'int' })
  collaboratorLimit!: number;

  @OneToMany(() => UserEntity, (user) => user.plan)
  users!: UserEntity[];
}
