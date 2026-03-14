import { NotificationRepository } from '../domain/repositories/notification.repository';

export class MarkNotificationAsReadUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(notificationId: string, userIdSession: string): Promise<void> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new Error('La notificación no existe');
    }

    // SEGURIDAD: Validar propiedad
    if (notification.userId !== userIdSession) {
      throw new Error('No tienes permiso para modificar esta notificación');
    }

    await this.notificationRepository.markAsRead(notificationId);
  }
}
