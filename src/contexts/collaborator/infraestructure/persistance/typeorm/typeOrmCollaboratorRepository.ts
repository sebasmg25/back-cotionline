import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { Collaborator } from '../../../domain/models/collaborator.model';
import {
  CollaboratorRepository,
  CollaboratorUpdateFields,
} from '../../../domain/repositories/collaborator.repository';
import { CollaboratorEntity } from './entities/collaborator.entity';

export class TypeORMCollaboratorRepository implements CollaboratorRepository {
  private ormRepository: Repository<CollaboratorEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(CollaboratorEntity);
  }

  /**
   * MÉTODO MAPPER: Transforma la entidad de BD al modelo de Dominio.
   */
  private mapToDomain(entity: CollaboratorEntity): Collaborator {
    return new Collaborator(
      entity.email,
      entity.invitationStatus,
      entity.userId,
      entity.createdAt,
      entity.id,
    );
  }

  async save(collaborator: Collaborator): Promise<Collaborator> {
    const entity = this.ormRepository.create({ ...collaborator });
    const savedEntity = await this.ormRepository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async findById(id: string): Promise<Collaborator | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Collaborator | null> {
    const entity = await this.ormRepository.findOne({ where: { email } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async update(
    id: string,
    updateFields: CollaboratorUpdateFields,
  ): Promise<Collaborator | null> {
    const updateResult = await this.ormRepository.update(id, updateFields);

    if (updateResult.affected === 0) return null;

    const updatedEntity = await this.ormRepository.findOne({ where: { id } });
    return updatedEntity ? this.mapToDomain(updatedEntity) : null;
  }

  async delete(id: string): Promise<Collaborator | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    if (!entity) return null;

    const deleteResult = await this.ormRepository.delete(id);

    return deleteResult.affected && deleteResult.affected > 0
      ? this.mapToDomain(entity)
      : null;
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.ormRepository.count({
      where: { userId },
    });
  }

  async findCollaboratorsByUserId(userId: string): Promise<Collaborator[]> {
    const entities = await this.ormRepository.find({ where: { userId } });
    return entities.map((entity) => this.mapToDomain(entity));
  }
}
