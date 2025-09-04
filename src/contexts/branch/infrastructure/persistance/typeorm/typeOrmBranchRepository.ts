import { Repository, UpdateResult } from "typeorm";
import {AppDataSource} from '../../../../shared/infraestructure/config/database';
import { Branch } from "../../../domain/models/branch.model";
import { BranchRepository, BranchUpdateFields } from "../../../domain/repositories/branch.repository";
import { BranchEntity } from "../typeorm/entities/branch.entitiy";


export class TypeORMBranchRepository implements BranchRepository{
    private ormRepository: Repository<BranchEntity>;

    constructor(){
        this.ormRepository = AppDataSource.getRepository(BranchEntity);
    }
    async findById(id: string): Promise<Branch | null> {
        const branchEntity = await this.ormRepository.findOne({where: {id}});

        if(!branchEntity){
            return null;
        }

        return new Branch(
            branchEntity.name,
            branchEntity.address,
            branchEntity.city,
            branchEntity.business,
            branchEntity.id
        )
    }

    async save(branch: Branch): Promise<Branch>{
        const branchEntity = this.ormRepository.create(branch);
        const savedEntity = await this.ormRepository.save(branchEntity);

        return new Branch(savedEntity.name, savedEntity.address, savedEntity.city,
            savedEntity.business, savedEntity.id);
    }

    async findByName(name: string): Promise<Branch | null>{
        const branchEntity = await this.ormRepository.findOne({where: {name}});

        if(!branchEntity){
            return null;
        }

        return new Branch(branchEntity.name, branchEntity.address, branchEntity.city,
            branchEntity.business, branchEntity.id);
    }

    async update(
    id: string,
    updateFields: BranchUpdateFields
  ): Promise<Branch | null> {
    const updateResult: UpdateResult = await this.ormRepository.update(
      id,
      updateFields
    );

    if (updateResult.affected === 0) {
      return null;
    }
    const updateBranchEntity = await this.ormRepository.findOne({
      where: { id },
    });
    if (updateBranchEntity) {
      return new Branch(
        updateBranchEntity.name,
        updateBranchEntity.address,
        updateBranchEntity.city,
        updateBranchEntity.business,
      );
    }
    return null;
  }

    async delete(id: string): Promise<void>{
        await this.ormRepository.delete(id);
    }
}