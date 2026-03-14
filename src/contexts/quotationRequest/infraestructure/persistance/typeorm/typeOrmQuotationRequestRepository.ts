import {
  Repository,
  MoreThanOrEqual,
  ILike,
  Not,
  In,
  LessThan,
  MoreThan,
} from 'typeorm';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { QuotationRequestEntity } from './entities/quotationRequest.entity';
import {
  QuotationRequest,
  QuotationRequestStatus,
} from '../../../domain/models/quotationRequest.model';
import { Product } from '../../../../product/domain/models/product.model';
import {
  QuotationRequestRepository,
  QuotationRequestUpdateFields,
} from '../../../domain/repositories/quotationRequest.repository';

export class TypeORMQuotationRequestRepository implements QuotationRequestRepository {
  private ormRepository: Repository<QuotationRequestEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(QuotationRequestEntity);
  }

  /**
   * MÉTODO MAPPER: Centraliza la conversión de la entidad de DB al modelo de Dominio.
   */
  private mapToDomain(entity: QuotationRequestEntity): QuotationRequest {
    const products = entity.products?.map(
      (p) =>
        new Product(
          p.name,
          p.amount,
          p.unitOfMeasurement,
          p.description,
          p.quotationRequestId,
          p.id,
        ),
    );

    return new QuotationRequest(
      entity.title,
      entity.description,
      entity.responseDeadline,
      entity.status as QuotationRequestStatus,
      entity.branch,
      entity.userId,
      entity.id,
      products,
      entity.createdAt,
    );
  }

  async save(quotationRequest: QuotationRequest): Promise<QuotationRequest> {
    const entityToSave = this.ormRepository.create({ ...quotationRequest });
    const savedEntity = await this.ormRepository.save(entityToSave);
    const reloadedEntity = await this.ormRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['products'],
      order: { products: { createdAt: 'ASC' } },
    });
    return this.mapToDomain(reloadedEntity!);
  }

  async findById(id: string): Promise<QuotationRequest | null> {
    const entity = await this.ormRepository.findOne({
      where: { id },
      relations: ['products'],
      order: { products: { createdAt: 'ASC' } },
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findQuotationRequestsByUserId(
    userId: string,
  ): Promise<QuotationRequest[]> {
    const entities = await this.ormRepository.find({
      where: { userId },
      relations: ['products'],
      order: { products: { createdAt: 'ASC' } },
    });
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async findByTitle(
    title: string,
    userId: string,
  ): Promise<QuotationRequest[]> {
    const entities = await this.ormRepository.find({
      where: { title: ILike(`%${title}%`), userId },
      relations: ['products'],
      order: { products: { createdAt: 'ASC' } },
    });
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async findActiveQuotationRequests(
    userIdToExclude: string,
    filters?: { department?: string; city?: string },
  ): Promise<QuotationRequest[]> {
    const where: any = {
      status: In([
        QuotationRequestStatus.PENDING,
        QuotationRequestStatus.QUOTED,
      ]),
      userId: Not(userIdToExclude),
    };

    // Filtros de usuario (ubicación)
    const userFilters: any = {};
    if (filters?.department) {
      userFilters.department = ILike(`%${filters.department}%`);
    }
    if (filters?.city) {
      userFilters.city = ILike(`%${filters.city}%`);
    }

    if (Object.keys(userFilters).length > 0) {
      where.user = userFilters;
    }

    const entities = await this.ormRepository.find({
      where,
      relations: ['products', 'user'],
      order: { createdAt: 'DESC', products: { createdAt: 'ASC' } },
    });

    return entities.map((entity) => this.mapToDomain(entity));
  }

  async update(
    id: string,
    updateFields: QuotationRequestUpdateFields,
  ): Promise<QuotationRequest | null> {
    const updateResult = await this.ormRepository.update(id, updateFields);
    if (updateResult.affected === 0) return null;

    const updatedEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['products'],
      order: { products: { createdAt: 'ASC' } },
    });
    return updatedEntity ? this.mapToDomain(updatedEntity) : null;
  }

  async delete(id: string): Promise<QuotationRequest | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    if (!entity) return null;

    const deleteResult = await this.ormRepository.delete(id);
    return deleteResult.affected && deleteResult.affected > 0
      ? this.mapToDomain(entity)
      : null;
  }

  async countSince(userId: string, startDate: Date): Promise<number> {
    return await this.ormRepository.count({
      where: {
        userId,
        createdAt: MoreThanOrEqual(startDate),
      },
    });
  }

  async updateExpiredStatus(filters: {
    userId?: string;
    id?: string;
  }): Promise<void> {
    const now = new Date();
    await this.ormRepository.update(
      {
        ...filters,
        status: Not(
          In([
            QuotationRequestStatus.CLOSED,
            QuotationRequestStatus.EXPIRED,
            QuotationRequestStatus.DRAFT,
          ]),
        ),
        responseDeadline: LessThan(now),
      },
      { status: QuotationRequestStatus.EXPIRED },
    );
  }

  async countActiveByBranchId(branchId: string): Promise<number> {
    return await this.ormRepository.count({
      where: {
        branch: branchId,
        status: In([
          QuotationRequestStatus.PENDING,
          QuotationRequestStatus.QUOTED,
        ]),
      },
    });
  }
}
