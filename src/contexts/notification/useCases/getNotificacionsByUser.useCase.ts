import { NotificationRepository } from '../domain/repositories/notification.repository';
import { NotificationResponse } from '../interfaces/dtos/notification.dto';

export class GetNotificationsByUserUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(userSession: {
    id: string;
    role: string;
    ownerId?: string;
  }): Promise<NotificationResponse[]> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;

    const notifications =
      await this.notificationRepository.findByUserId(effectiveOwnerId);

    return notifications.map((n) => ({
      id: n.id!,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      isRead: n.isRead,
      createdAt: n.createdAt,
      userId: n.userId,
    }));
  }
}
