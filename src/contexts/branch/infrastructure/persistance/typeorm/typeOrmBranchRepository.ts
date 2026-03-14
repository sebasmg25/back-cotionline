import { Repository, UpdateResult } from 'typeorm';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { Branch } from '../../../domain/models/branch.model';
import {
  BranchRepository,
  BranchUpdateFields,
} from '../../../domain/repositories/branch.repository';
import { BranchEntity } from './entities/branch.entity';

export class TypeORMBranchRepository implements BranchRepository {
  private ormRepository: Repository<BranchEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(BranchEntity);
  }

  /**
   * MÉTODO MAPPER: Centraliza la conversión de Entity a Domain
   */
  private mapToDomain(entity: BranchEntity): Branch {
    return new Branch(
      entity.name,
      entity.address,
      entity.city,
      entity.businessId,
      entity.id, // ID siempre al final según tu constructor
    );
  }

  async save(branch: Branch): Promise<Branch> {
    const branchEntity = this.ormRepository.create({ ...branch });
    const savedEntity = await this.ormRepository.save(branchEntity);

    return this.mapToDomain(savedEntity);
  }

  async findById(id: string): Promise<Branch | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByName(name: string): Promise<Branch | null> {
    const entity = await this.ormRepository.findOne({ where: { name } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async update(
    id: string,
    updateFields: BranchUpdateFields,
  ): Promise<Branch | null> {
    const updateResult: UpdateResult = await this.ormRepository.update(
      id,
      updateFields,
    );

    if (updateResult.affected === 0) return null;

    const updatedEntity = await this.ormRepository.findOne({ where: { id } });
    return updatedEntity ? this.mapToDomain(updatedEntity) : null;
  }

  async delete(id: string): Promise<Branch | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });

    if (!entity) return null;

    const deleteResult = await this.ormRepository.delete(id);

    if (deleteResult.affected && deleteResult.affected > 0) {
      return this.mapToDomain(entity);
    }

    return null;
  }

  async findBranchesByBusinessId(businessId: string): Promise<Branch[]> {
    const entities = await this.ormRepository.find({ where: { businessId } });
    return entities.map((entity) => this.mapToDomain(entity));
  }
}
