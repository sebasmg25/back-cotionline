import { Repository, MoreThanOrEqual, Not } from 'typeorm';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { Quotation, QuotationStatus } from '../../../domain/models/quotation.model';
import {
  QuotationRepository,
  QuotationUpdateFields,
} from '../../../domain/repositories/quotation.repository';
import { QuotationEntity } from './entities/quotation.entity';

export class TypeORMQuotationRepository implements QuotationRepository {
  private ormRepository: Repository<QuotationEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(QuotationEntity);
  }

  private mapToDomain(entity: QuotationEntity): Quotation {
    const quotation = new Quotation(
      entity.responseDeadline,
      entity.quotationRequestId,
      entity.userId,
      entity.price,
      entity.deliveryTime,
      entity.status as QuotationStatus,
      entity.description,
      entity.individualValues,
      entity.id,
      entity.issueDate,
    );
    if ((entity as any).user?.businesses?.length > 0) {
      quotation.businessName = (entity as any).user.businesses[0].name;
    }
    return quotation;
  }

  async save(quotation: Quotation): Promise<Quotation> {
    const entity = this.ormRepository.create({ ...quotation });
    const savedEntity = await this.ormRepository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async findById(id: string): Promise<Quotation | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByUserAndQuotationRequest(
    userId: string,
    quotationRequestId: string,
  ): Promise<Quotation | null> {
    const entity = await this.ormRepository.findOne({
      where: { userId, quotationRequestId },
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByQuotationRequestId(
    quotationRequestId: string,
  ): Promise<Quotation[]> {
    const entities = await this.ormRepository.find({
      where: {
        quotationRequestId,
        status: Not(QuotationStatus.DRAFT),
      },
      relations: ['user', 'user.businesses'],
    });
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async update(
    id: string,
    updateFields: QuotationUpdateFields,
  ): Promise<Quotation | null> {
    const updateResult = await this.ormRepository.update(id, updateFields);

    if (updateResult.affected === 0) return null;

    const updatedEntity = await this.ormRepository.findOne({ where: { id } });
    return updatedEntity ? this.mapToDomain(updatedEntity) : null;
  }

  async delete(id: string): Promise<Quotation | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    if (!entity) return null;

    const deleteResult = await this.ormRepository.delete(id);

    return deleteResult.affected && deleteResult.affected > 0
      ? this.mapToDomain(entity)
      : null;
  }

  async findAllByUserId(userId: string): Promise<Quotation[]> {
    const entities = await this.ormRepository.find({
      where: { userId },
      order: { issueDate: 'DESC' },
    });
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async findReceivedByUserId(userId: string): Promise<Quotation[]> {
    const entities = await this.ormRepository.find({
      relations: ['quotationRequest', 'user', 'user.businesses'],
      where: {
        quotationRequest: {
          userId: userId,
        },
        status: Not(QuotationStatus.DRAFT),
      },
      order: { issueDate: 'DESC' },
    });
    return entities.map((entity) => {
      const q = this.mapToDomain(entity);
      (q as any).requestTitle = entity.quotationRequest?.title;
      return q;
    });
  }

  async countSince(userId: string, startDate: Date): Promise<number> {
    return await this.ormRepository.count({
      where: {
        userId,
        issueDate: MoreThanOrEqual(startDate),
      },
    });
  }
}
