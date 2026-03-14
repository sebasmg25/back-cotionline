import { Repository } from 'typeorm';
import { User, UserRole } from '../../../domain/models/user.model';
import {
  UserRepository,
  UserUpdateFields,
} from '../../../domain/repositories/user.repository';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { UserEntity } from './entities/user.entity';

export class TypeORMUserRepository implements UserRepository {
  private ormRepository: Repository<UserEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserEntity);
  }

  /**
   * MÉTODO MAPPER: Centraliza la creación del modelo de dominio.
   * Maneja la conversión de fechas y campos opcionales en un solo lugar.
   */
  private mapToDomain(entity: UserEntity): User {
    return new User(
      entity.identification,
      entity.name,
      entity.lastName,
      entity.email,
      entity.password,
      entity.department,
      entity.city,
      entity.id,
      entity.planId,
      entity.planStartDate ? new Date(entity.planStartDate) : undefined,
      entity.role,
      entity.ownerId,
    );
  }

  async save(user: User): Promise<User> {
    const entityToSave = this.ormRepository.create({ ...user });
    const savedEntity = await this.ormRepository.save(entityToSave);
    return this.mapToDomain(savedEntity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByIdentification(identification: string): Promise<User | null> {
    const entity = await this.ormRepository.findOne({
      where: { identification },
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepository.findOne({ where: { email } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async update(id: string, updates: UserUpdateFields): Promise<User | null> {
    const updateResult = await this.ormRepository.update(id, updates);
    if (updateResult.affected === 0) return null;

    const updatedEntity = await this.ormRepository.findOne({ where: { id } });
    return updatedEntity ? this.mapToDomain(updatedEntity) : null;
  }

  async updatePlan(
    userId: string,
    planId: string,
    isFree: boolean = false,
  ): Promise<User | null> {
    const startDate = isFree ? null : new Date();

    await this.ormRepository.update(userId, {
      planId: planId,
      planStartDate: startDate as any,
    });

    return await this.findById(userId);
  }

  async delete(id: string): Promise<User | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    if (!entity) return null;

    const deleteResult = await this.ormRepository.delete(id);
    return deleteResult.affected && deleteResult.affected > 0
      ? this.mapToDomain(entity)
      : null;
  }

  async findCollaboratorsByOwnerId(ownerId: string): Promise<User[]> {
    const entities = await this.ormRepository.find({
      where: {
        ownerId,
        role: UserRole.COLLABORATOR,
      },
    });
    return entities.map((entity) => this.mapToDomain(entity));
  }
}
