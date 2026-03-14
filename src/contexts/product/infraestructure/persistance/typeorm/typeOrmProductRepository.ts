import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { Product } from '../../../domain/models/product.model';
import {
  ProductRepository,
  ProductUpdateFields,
} from '../../../domain/repositories/product.repository';
import { ProductEntity } from './entities/product.entity';

export class TypeORMProductRepository implements ProductRepository {
  private ormRepository: Repository<ProductEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(ProductEntity);
  }

  /**
   * MÉTODO MAPPER: Centraliza la creación del modelo de dominio.
   */
  private mapToDomain(entity: ProductEntity): Product {
    return new Product(
      entity.name,
      entity.amount,
      entity.unitOfMeasurement,
      entity.description,
      entity.quotationRequestId,
      entity.id,
    );
  }

  async save(product: Product): Promise<Product> {
    const entity = this.ormRepository.create({ ...product });
    const savedEntity = await this.ormRepository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByName(name: string): Promise<Product | null> {
    const entity = await this.ormRepository.findOne({ where: { name } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async update(
    id: string,
    updateFields: ProductUpdateFields,
  ): Promise<Product | null> {
    const updateResult = await this.ormRepository.update(id, updateFields);

    if (updateResult.affected === 0) return null;

    const updatedEntity = await this.ormRepository.findOne({ where: { id } });
    return updatedEntity ? this.mapToDomain(updatedEntity) : null;
  }

  async delete(id: string): Promise<Product | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    if (!entity) return null;

    const deleteResult = await this.ormRepository.delete(id);

    return deleteResult.affected && deleteResult.affected > 0
      ? this.mapToDomain(entity)
      : null;
  }

  async findProductsByQuotationRequestId(
    quotationRequestId: string,
  ): Promise<Product[]> {
    const entities = await this.ormRepository.find({
      where: { quotationRequestId },
      order: { createdAt: 'ASC' } as any,
    });
    return entities.map((entity) => this.mapToDomain(entity));
  }
}
