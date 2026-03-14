import { GetNotificationsByUserUseCase } from '../../../src/contexts/notification/useCases/getNotificacionsByUser.useCase';

describe('GetNotificationsByUserUseCase', () => {
  let useCase: GetNotificationsByUserUseCase;
  let mockNotificationRepository: any;

  beforeEach(() => {
    mockNotificationRepository = {
      findByUserId: jest.fn()
    };
    useCase = new GetNotificationsByUserUseCase(mockNotificationRepository);
  });

  const validSession = { id: 'owner-1', role: 'OWNER' };
  const collabSession = { id: 'collab-1', role: 'COLLABORATOR', ownerId: 'boss-1' };

  it('should fetch notifications using the direct id if owner', async () => {
    mockNotificationRepository.findByUserId.mockResolvedValue([
      { id: 'notif-1', title: 'Test 1' },
      { id: 'notif-2', title: 'Test 2' }
    ]);

    const result = await useCase.execute(validSession);
    expect(mockNotificationRepository.findByUserId).toHaveBeenCalledWith('owner-1');
    expect(result.length).toBe(2);
    expect(result[0].title).toBe('Test 1');
  });

  it('should fetch notifications using the ownerId if collaborator', async () => {
    mockNotificationRepository.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute(collabSession);
    expect(mockNotificationRepository.findByUserId).toHaveBeenCalledWith('boss-1');
    expect(result.length).toBe(0);
  });
});
