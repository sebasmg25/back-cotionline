import { Repository, UpdateResult } from 'typeorm';
import { QuotationRequestEntity } from './entities/quotationRequest.entity';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { QuotationRequest } from '../../../domain/models/quotationRequest.model';
import {
  QuotationRequestRepository,
  QuotationRequestUpdateFields,
} from '../../../domain/repositories/quotationRequest.repository';

export class TypeORMQuotationRequestRepository
  implements QuotationRequestRepository
{
  private ormRepository: Repository<QuotationRequestEntity>;
  constructor() {
    this.ormRepository = AppDataSource.getRepository(QuotationRequestEntity);
  }

  async save(quotationRequest: QuotationRequest): Promise<QuotationRequest> {
    const quotationRequestToSave = await this.ormRepository.create({
      ...quotationRequest,
    });

    const savedQuotationRequest = await this.ormRepository.save(
      quotationRequestToSave
    );

    return new QuotationRequest(
      savedQuotationRequest.responseDeadline,
      savedQuotationRequest.status,
      savedQuotationRequest.branch,
      savedQuotationRequest.userId,
      savedQuotationRequest.id
    );
  }

  async update(
    id: string,
    quotationRequestUpdateFields: QuotationRequestUpdateFields
  ): Promise<QuotationRequest | null> {
    const updateResult: UpdateResult = await this.ormRepository.update(
      id,
      quotationRequestUpdateFields
    );

    if (updateResult.affected === 0) {
      return null;
    }

    const updatedQuotationRequestEntity = await this.ormRepository.findOne({
      where: { id },
    });

    if (updatedQuotationRequestEntity) {
      return new QuotationRequest(
        updatedQuotationRequestEntity.responseDeadline,
        updatedQuotationRequestEntity.status,
        updatedQuotationRequestEntity.branch,
        updatedQuotationRequestEntity.userId,
        updatedQuotationRequestEntity.id
      );
    }
    return null;
  }

  async delete(id: string): Promise<QuotationRequest | null> {
    const existQuotationRequest = await this.ormRepository.findOne({
      where: { id },
    });
    if (!existQuotationRequest) {
      return null;
    }

    const deletedResult = await this.ormRepository.delete(id);
    if (deletedResult.affected === 0) {
      console.log('No se pudo eliminar la solicitud de cotización.');
      return null;
    }
    return new QuotationRequest(
      existQuotationRequest.responseDeadline,
      existQuotationRequest.status,
      existQuotationRequest.branch,
      existQuotationRequest.userId,
      existQuotationRequest.id
    );
  }

  async findById(id: string): Promise<QuotationRequest | null> {
    const existQuotationRequest = await this.ormRepository.findOne({
      where: { id },
    });

    if (!existQuotationRequest) {
      return null;
    }

    return new QuotationRequest(
      existQuotationRequest.responseDeadline,
      existQuotationRequest.status,
      existQuotationRequest.branch,
      existQuotationRequest.userId,
      existQuotationRequest.id
    );
  }
}
