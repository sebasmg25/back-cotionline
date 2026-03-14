import { NotificationType } from '../../domain/models/notification.model';

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: Date;
  userId: string;
}
