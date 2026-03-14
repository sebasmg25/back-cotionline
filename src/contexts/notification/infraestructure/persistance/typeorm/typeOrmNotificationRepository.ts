import { Repository, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../../../../shared/infraestructure/config/database';
import { Notification } from '../../../domain/models/notification.model';
import { NotificationRepository } from '../../../domain/repositories/notification.repository';
import { NotificationEntity } from './entities/notification.entity';

export class TypeORMNotificationRepository implements NotificationRepository {
  private ormRepository: Repository<NotificationEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(NotificationEntity);
  }

  /**
   * MÉTODO MAPPER: Centraliza la conversión para objetos únicos y colecciones.
   */
  private mapToDomain(entity: NotificationEntity): Notification {
    return new Notification(
      entity.type,
      entity.title,
      entity.message,
      entity.link,
      entity.isRead,
      entity.createdAt,
      entity.userId,
      entity.id,
    );
  }

  async save(notification: Notification): Promise<Notification> {
    const entity = this.ormRepository.create({ ...notification });
    const savedEntity = await this.ormRepository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const entities = await this.ormRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Transformación limpia de toda la lista
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const entity = await this.ormRepository.findOne({
      where: { id: notificationId },
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async markAsRead(id: string): Promise<void> {
    const updateResult = await this.ormRepository.update(id, { isRead: true });
    if (updateResult.affected === 0) {
      throw new Error('No se encontró la notificación para marcar como leída');
    }
  }

  async findNotificationByDate(
    userId: string,
    title: string,
    date: Date,
  ): Promise<Notification | null> {
    const entity = await this.ormRepository.findOne({
      where: {
        userId,
        title,
        createdAt: MoreThanOrEqual(date),
      },
    });

    return entity ? this.mapToDomain(entity) : null;
  }
}
