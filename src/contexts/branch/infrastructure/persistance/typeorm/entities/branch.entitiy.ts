import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Branch } from "../../../../domain/models/branch.model";

@Entity('sedes')
export class BranchEntity extends Branch {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column ({unique: true})
    name!: string;

    @Column()
    address!: string;

    @Column()
    city!: string;

    @Column()
    business!: string;
}