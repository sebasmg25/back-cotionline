import { PlanRepository } from '../domain/repositories/plan.repository';
import { UserRepository } from '../../user/domain/repositories/user.repository';
import { NotificationType } from '../../notification/domain/models/notification.model';
import { SendNotificationUseCase } from '../../notification/useCases/sendNotification.useCase';
import { NotificationRepository } from '../../notification/domain/repositories/notification.repository';
import { PlanName } from '../domain/models/plan.model'; // Asegúrate de importar tu Enum

export class CheckPlanExpirationUseCase {
  constructor(
    private planRepository: PlanRepository,
    private userRepository: UserRepository,
    private notificationRepository: NotificationRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    // Blindaje inicial: Si no hay usuario o es gratuito por defecto (sin fecha), salimos.
    if (!user || !user.planId || !user.planStartDate) return;

    const currentPlan = await this.planRepository.findById(user.planId);

    // Si el plan es el GRATUITO, no tiene sentido calcular expiración.
    if (!currentPlan || currentPlan.name === PlanName.FREE) return;

    const now = new Date();
    const startDate = new Date(user.planStartDate);

    // Normalización a medianoche para cálculo por días calendario
    const startMidnight = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    );
    const nowMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const diffTime = nowMidnight.getTime() - startMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysRemaining = 30 - diffDays;

    // 1. LÓGICA DE ADVERTENCIA (Faltan 3, 2 o 1 día)
    if (daysRemaining <= 3 && daysRemaining > 0) {
      const title = 'Tu plan vence pronto';
      const alreadyNotifiedToday =
        await this.notificationRepository.findNotificationByDate(
          user.id!,
          title,
          nowMidnight,
        );

      if (!alreadyNotifiedToday) {
        await this.sendNotificationUseCase.execute(
          NotificationType.SYSTEM,
          title,
          `Te quedan ${daysRemaining} días de tu plan ${currentPlan.name}. Renueva para no perder tus beneficios.`,
          '/dashboard/profile/subscription',
          user.id!,
        );
      }
    }

    // 2. LÓGICA DE DEGRADACIÓN (Día 31 en adelante)
    if (diffDays >= 30) {
      const freePlan = await this.planRepository.findByName(PlanName.FREE);

      if (freePlan && user.planId !== freePlan.id) {
        // El tercer parámetro 'true' indica reseteo de límites/contadores
        await this.userRepository.updatePlan(user.id!, freePlan.id, true);

        await this.sendNotificationUseCase.execute(
          NotificationType.SYSTEM,
          'Suscripción expirada',
          `Tu plan ${currentPlan.name} ha vencido. Se ha restablecido el límite de colaboradores, solicitudes y cotizaciones.`,
          '/dashboard/profile/subscription',
          user.id!,
        );

        console.log(
          `[Subscription] Plan expirado: ${user.email}. Degradado a GRATUITO.`,
        );
      }
    }
  }
}
