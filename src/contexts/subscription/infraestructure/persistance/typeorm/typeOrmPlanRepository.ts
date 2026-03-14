import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { PlanEntity } from './entities/plan.entity';
import { Plan, PlanName } from '../../../domain/models/plan.model';
import { PlanRepository } from '../../../domain/repositories/plan.repository';

export class TypeORMPlanRepository implements PlanRepository {
  private ormRepository: Repository<PlanEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(PlanEntity);
  }

  /**
   * MÉTODO MAPPER: Centraliza la instanciación de los Planes.
   */
  private mapToDomain(entity: PlanEntity): Plan {
    return new Plan(
      entity.id,
      entity.name as PlanName,
      entity.price,
      entity.requestLimit,
      entity.quotationLimit,
      entity.collaboratorLimit,
    );
  }

  async findAll(): Promise<Plan[]> {
    const entities = await this.ormRepository.find();
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async findById(id: string): Promise<Plan | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByName(name: string): Promise<Plan | null> {
    // Usamos el casting aquí para que TypeORM entienda el filtro sobre el nombre
    const entity = await this.ormRepository.findOne({
      where: { name: name as any },
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async save(plan: Plan): Promise<Plan> {
    const entityToSave = this.ormRepository.create({ ...plan });
    const savedEntity = await this.ormRepository.save(entityToSave);
    return this.mapToDomain(savedEntity);
  }
}
