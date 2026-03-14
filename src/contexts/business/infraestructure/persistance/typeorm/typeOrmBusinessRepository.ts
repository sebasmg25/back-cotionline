import { Repository, UpdateResult } from 'typeorm';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import {
  Business,
  BusinessStatus,
} from '../../../domain/models/business.model';
import {
  BusinessRepository,
  BusinessUpdateFields,
} from '../../../domain/repositories/business.repository';
import { BusinessEntity } from './entities/business.entity';

export class TypeORMBusinessRepository implements BusinessRepository {
  private ormRepository: Repository<BusinessEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(BusinessEntity);
  }

  /**
   * MÉTODO MAPPER: Centraliza la lógica de conversión.
   * Si mañana cambias el orden del constructor en Business.ts, solo tocas aquí.
   */
  private mapToDomain(entity: BusinessEntity): Business {
    return new Business(
      entity.nit,
      entity.name,
      entity.description,
      entity.address,
      entity.userId,
      entity.status as BusinessStatus,
      entity.rutUrl ?? undefined,
      entity.chamberOfCommerceUrl ?? undefined,
      entity.id,
    );
  }

  async save(business: Business): Promise<Business> {
    const businessToSave = this.ormRepository.create(business);
    const savedEntity = await this.ormRepository.save(businessToSave);
    return this.mapToDomain(savedEntity);
  }

  async findById(id: string): Promise<Business | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByNit(nit: string): Promise<Business | null> {
    const entity = await this.ormRepository.findOne({ where: { nit } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Business | null> {
    const entity = await this.ormRepository.findOne({ where: { userId } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async update(
    id: string,
    updateFields: BusinessUpdateFields,
  ): Promise<Business | null> {
    const updateResult: UpdateResult = await this.ormRepository.update(
      id,
      updateFields,
    );

    if (updateResult.affected === 0) return null;

    const updatedEntity = await this.ormRepository.findOne({ where: { id } });
    return updatedEntity ? this.mapToDomain(updatedEntity) : null;
  }

  async delete(id: string): Promise<Business | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    if (!entity) return null;

    const deleteResult = await this.ormRepository.delete(id);
    return deleteResult.affected && deleteResult.affected > 0
      ? this.mapToDomain(entity)
      : null;
  }
}
