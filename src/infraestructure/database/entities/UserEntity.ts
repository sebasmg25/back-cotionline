import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../../domain/models/User';

@Entity('users')
export class UserEntity extends User {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ unique: true })
  identification!: string;

  @Column()
  name!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  city!: string;
}
