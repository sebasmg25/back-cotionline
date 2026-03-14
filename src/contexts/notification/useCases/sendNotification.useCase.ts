import {
  Notification,
  NotificationType,
} from '../domain/models/notification.model';
import { NotificationRepository } from '../domain/repositories/notification.repository';
import { NotificationResponse } from '../interfaces/dtos/notification.dto';

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(
    type: NotificationType,
    title: string,
    message: string,
    link: string,
    targetUserId: string, // El usuario que recibirá la notificación
  ): Promise<NotificationResponse> {
    const notification = new Notification(
      type,
      title,
      message,
      link,
      false,
      new Date(),
      targetUserId,
    );

    const saved = await this.notificationRepository.save(notification);

    return {
      id: saved.id!,
      type: saved.type,
      title: saved.title,
      message: saved.message,
      link: saved.link,
      isRead: saved.isRead,
      createdAt: saved.createdAt,
      userId: saved.userId,
    };
  }
}
