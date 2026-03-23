import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../user/infraestructure/persistance/typeorm/entities/user.entity';
import { InvitationStatus } from '../../../../domain/models/collaborator.model';

@Entity('collaborators')
export class CollaboratorEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  invitationStatus!: InvitationStatus;

  @Column()
  createdAt!: Date;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.collaborators, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
