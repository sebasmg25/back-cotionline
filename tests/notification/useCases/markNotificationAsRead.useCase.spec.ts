import { MarkNotificationAsReadUseCase } from '../../../src/contexts/notification/useCases/markNotificationAsRead.useCase';

describe('MarkNotificationAsReadUseCase', () => {
  let useCase: MarkNotificationAsReadUseCase;
  let mockNotificationRepository: any;

  beforeEach(() => {
    mockNotificationRepository = {
      findById: jest.fn(),
      markAsRead: jest.fn()
    };
    useCase = new MarkNotificationAsReadUseCase(mockNotificationRepository);
  });

  it('should throw an error if notification does not exist', async () => {
    mockNotificationRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('notif-1', 'user-1')).rejects.toThrow('La notificación no existe');
  });

  it('should throw an error if the user does not own the notification', async () => {
    mockNotificationRepository.findById.mockResolvedValue({ userId: 'hacker-user' });
    await expect(useCase.execute('notif-1', 'user-1')).rejects.toThrow('No tienes permiso para modificar esta notificación');
  });

  it('should cleanly mark the notification as read', async () => {
    mockNotificationRepository.findById.mockResolvedValue({ userId: 'user-1' });
    mockNotificationRepository.markAsRead.mockResolvedValue(undefined);

    await useCase.execute('notif-1', 'user-1');
    expect(mockNotificationRepository.markAsRead).toHaveBeenCalledWith('notif-1');
  });
});
