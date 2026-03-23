import { CheckPlanExpirationUseCase } from '../../../src/contexts/subscription/useCases/checkPlanExpiration.useCase';
import { PlanName } from '../../../src/contexts/subscription/domain/models/plan.model';
import { NotificationType } from '../../../src/contexts/notification/domain/models/notification.model';

describe('CheckPlanExpirationUseCase', () => {
  let useCase: CheckPlanExpirationUseCase;
  let mockPlanRepository: any;
  let mockUserRepository: any;
  let mockNotificationRepository: any;
  let mockSendNotificationUseCase: any;

  beforeEach(() => {
    mockPlanRepository = {
      findById: jest.fn(),
      findByName: jest.fn()
    };
    mockUserRepository = {
      findById: jest.fn(),
      updatePlan: jest.fn()
    };
    mockNotificationRepository = {
      findNotificationByDate: jest.fn()
    };
    mockSendNotificationUseCase = {
      execute: jest.fn()
    };

    useCase = new CheckPlanExpirationUseCase(
      mockPlanRepository,
      mockUserRepository,
      mockNotificationRepository,
      mockSendNotificationUseCase
    );

    // Mock Date.now to have predictable tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should exit early if user or user plan is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await useCase.execute('user-1');
    expect(mockPlanRepository.findById).not.toHaveBeenCalled();

    mockUserRepository.findById.mockResolvedValue({ id: 'user-1' }); // No planId
    await useCase.execute('user-1');
    expect(mockPlanRepository.findById).not.toHaveBeenCalled();
  });

  it('should exit early if the current plan is already FREE', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: 'user-1', planId: 'plan-1', planStartDate: new Date() });
    mockPlanRepository.findById.mockResolvedValue({ name: PlanName.FREE });

    await useCase.execute('user-1');
    expect(mockSendNotificationUseCase.execute).not.toHaveBeenCalled();
  });

  it('should send a warning notification if plan expires in 3 days or less', async () => {
    const today = new Date('2026-10-30T10:00:00Z');
    jest.setSystemTime(today);
    
    // Start date was 28 days ago, so 2 days remaining (30 - 28)
    const startDate = new Date('2026-10-02T10:00:00Z');
    
    mockUserRepository.findById.mockResolvedValue({ id: 'user-1', planId: 'plan-premium', planStartDate: startDate });
    mockPlanRepository.findById.mockResolvedValue({ name: PlanName.PREMIUM }); // Premium
    mockNotificationRepository.findNotificationByDate.mockResolvedValue(null); // No notification sent today

    await useCase.execute('user-1');

    expect(mockSendNotificationUseCase.execute).toHaveBeenCalledWith(
      NotificationType.SYSTEM,
      'Tu plan vence pronto',
      'Te quedan 2 días de tu plan PREMIUM. Renueva para no perder tus beneficios.',
      '/dashboard/profile/subscription',
      'user-1'
    );
  });

  it('should NOT send warning notification if already notified today', async () => {
    const today = new Date('2026-10-30T10:00:00Z');
    jest.setSystemTime(today);
    const startDate = new Date('2026-10-02T10:00:00Z'); // 2 days remaining
    
    mockUserRepository.findById.mockResolvedValue({ id: 'user-1', planId: 'plan-premium', planStartDate: startDate });
    mockPlanRepository.findById.mockResolvedValue({ name: PlanName.PREMIUM });
    mockNotificationRepository.findNotificationByDate.mockResolvedValue({}); // Found existing notification

    await useCase.execute('user-1');

    expect(mockSendNotificationUseCase.execute).not.toHaveBeenCalled();
  });

  it('should downgrade the user to FREE plan if 30 or more days have passed', async () => {
    const today = new Date('2026-11-01T10:00:00Z');
    jest.setSystemTime(today);
    
    // Start date was 30 days ago => Diff is 30. Expect downgrade.
    const startDate = new Date('2026-10-02T10:00:00Z');
    
    mockUserRepository.findById.mockResolvedValue({ id: 'user-1', planId: 'plan-premium', planStartDate: startDate, email: 'user@mail.com' });
    mockPlanRepository.findById.mockResolvedValue({ name: PlanName.PREMIUM });
    mockPlanRepository.findByName.mockResolvedValue({ id: 'plan-free-id' }); // Free plan to downgrade to

    await useCase.execute('user-1');

    // Verify user was updated to Free plan
    expect(mockUserRepository.updatePlan).toHaveBeenCalledWith('user-1', 'plan-free-id', true);

    // Verify expiration notification
    expect(mockSendNotificationUseCase.execute).toHaveBeenCalledWith(
      NotificationType.SYSTEM,
      'Suscripción expirada',
      'Tu plan PREMIUM ha vencido. Se ha restablecido el límite de colaboradores, solicitudes y cotizaciones.',
      '/dashboard/profile/subscription',
      'user-1'
    );
  });
});
