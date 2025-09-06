import { Repository, UpdateResult } from 'typeorm';
import { Business } from '../../../domain/models/business.model';
import {
  BusinessRepository,
  BusinessUpdateFields,
} from '../../../domain/repositories/business.repository';
import { BusinessEntity } from './entities/business.entity';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';

export class TypeORMBusinessRepository implements BusinessRepository {
  private ormRepository: Repository<BusinessEntity>;
  constructor() {
    this.ormRepository = AppDataSource.getRepository(BusinessEntity);
  }

  async save(business: Business): Promise<Business> {
    const businessToSave = await this.ormRepository.create({
      ...business,
    });

    const savedEntity = await this.ormRepository.save(businessToSave);
    console.log('NEGOCIO', savedEntity);

    return new Business(
      savedEntity.nit,
      savedEntity.name,
      savedEntity.description,
      savedEntity.address,
      savedEntity.userId,
      savedEntity.id
    );
  }

  async update(
    id: string,
    updateFields: BusinessUpdateFields
  ): Promise<Business | null> {
    const updateResult: UpdateResult = await this.ormRepository.update(
      id,
      updateFields
    );

    if (updateResult.affected === 0) {
      return null;
    }
    const updateBusinessEntity = await this.ormRepository.findOne({
      where: { id },
    });
    if (updateBusinessEntity) {
      return new Business(
        updateBusinessEntity.nit,
        updateBusinessEntity.name,
        updateBusinessEntity.description,
        updateBusinessEntity.address,
        updateBusinessEntity.userId,
        updateBusinessEntity.id
      );
    }
    return null;
  }

  async findById(id: string): Promise<Business | null> {
    const businessEntity = await this.ormRepository.findOne({
      where: { id },
    });
    if (!businessEntity) {
      return null;
    }

    return new Business(
      businessEntity.nit,
      businessEntity.name,
      businessEntity.description,
      businessEntity.address,
      businessEntity.userId,
      businessEntity.id
    );
  }

  async findByNit(nit: string): Promise<Business | null> {
    const businessEntity = await this.ormRepository.findOne({ where: { nit } });

    if (!businessEntity) {
      return null;
    }
    return new Business(
      businessEntity.nit,
      businessEntity.name,
      businessEntity.description,
      businessEntity.address,
      businessEntity.userId,
      businessEntity.id
    );
  }

  async delete(id: string): Promise<Business | null> {
    const existBusiness = await this.ormRepository.findOne({ where: { id } });
    if (!existBusiness) {
      return null;
    }
    const deleteBusiness = await this.ormRepository.delete(id);
    if (
      deleteBusiness &&
      deleteBusiness.affected &&
      deleteBusiness.affected > 0
    ) {
      return new Business(
        existBusiness.nit,
        existBusiness.name,
        existBusiness.description,
        existBusiness.address,
        existBusiness.userId,
        existBusiness.id
      );
    }
    return null;
  }
}
