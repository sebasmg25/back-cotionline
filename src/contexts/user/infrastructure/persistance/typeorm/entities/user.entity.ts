import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BusinessEntity } from '../../../../../business/infraestructure/persistance/typeorm/entities/business.entity';
import { QuotationRequestEntity } from '../../../../../quotationRequest/infraestructure/persistance/typeorm/entities/quotationRequest.entity';

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
  city!: string;

  @OneToMany(() => BusinessEntity, (business) => business.user)
  businesses!: BusinessEntity[];

  @OneToMany(
    () => QuotationRequestEntity,
    (quotationRequest) => quotationRequest.user
  )
  quotationRequests!: QuotationRequestEntity[];
}
