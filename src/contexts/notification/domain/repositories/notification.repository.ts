import { Notification } from '../models/notification.model';

export interface NotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findById(notificationId: string): Promise<Notification | null>;
  findByUserId(userId: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  findNotificationByDate(
    userId: string,
    title: string,
    date: Date,
  ): Promise<Notification | null>;
}
