import { SendNotificationUseCase } from '../../../src/contexts/notification/useCases/sendNotification.useCase';
import { NotificationType } from '../../../src/contexts/notification/domain/models/notification.model';

describe('SendNotificationUseCase', () => {
  let useCase: SendNotificationUseCase;
  let mockNotificationRepository: any;

  beforeEach(() => {
    mockNotificationRepository = {
      save: jest.fn()
    };
    useCase = new SendNotificationUseCase(mockNotificationRepository);
  });

  it('should save a new notification and return proper data mapping', async () => {
    mockNotificationRepository.save.mockResolvedValue({
      id: 'notif-1',
      type: NotificationType.SYSTEM,
      title: 'Welcome',
      message: 'Hello world',
      link: '/home',
      isRead: false,
      userId: 'user-1'
    });

    const result = await useCase.execute(
      NotificationType.SYSTEM,
      'Welcome',
      'Hello world',
      '/home',
      'user-1'
    );

    expect(mockNotificationRepository.save).toHaveBeenCalled();
    expect(result.id).toBe('notif-1');
    expect(result.title).toBe('Welcome');
    expect(result.isRead).toBe(false);
  });
});
