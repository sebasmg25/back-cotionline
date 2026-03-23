import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BusinessEntity } from '../../../../../business/infraestructure/persistance/typeorm/entities/business.entity';
import { QuotationRequestEntity } from '../../../../../quotationRequest/infraestructure/persistance/typeorm/entities/quotationRequest.entity';
import { QuotationEntity } from '../../../../../quotation/infraestructure/persistance/typeorm/entities/quotation.entity';
import { CollaboratorEntity } from '../../../../../collaborator/infraestructure/persistance/typeorm/entities/collaborator.entity';
import { NotificationEntity } from '../../../../../notification/infraestructure/persistance/typeorm/entities/notification.entity';
import { PlanEntity } from '../../../../../subscription/infraestructure/persistance/typeorm/entities/plan.entity';

import { UserRole } from '../../../../domain/models/user.model';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
  department!: string;

  @Column()
  city!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OWNER,
  })
  role!: UserRole;

  @Column({ nullable: true })
  ownerId!: string;

  @Column({ nullable: true })
  planId!: string;

  @Column({ type: 'timestamp', nullable: true })
  planStartDate!: Date;

  @OneToMany(() => BusinessEntity, (business) => business.user)
  businesses!: BusinessEntity[];

  @OneToMany(
    () => QuotationRequestEntity,
    (quotationRequest) => quotationRequest.user,
  )
  quotationRequests!: QuotationRequestEntity[];

  @OneToMany(() => QuotationEntity, (quotation) => quotation.user)
  quotations!: QuotationEntity[];

  @OneToMany(() => CollaboratorEntity, (collaborator) => collaborator.user)
  collaborators!: CollaboratorEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications!: NotificationEntity[];

  @ManyToOne(() => PlanEntity, (plan) => plan.users)
  @JoinColumn({ name: 'planId' })
  plan!: PlanEntity;
}
