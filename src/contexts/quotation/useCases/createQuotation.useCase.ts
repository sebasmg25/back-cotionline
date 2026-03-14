import { Quotation, QuotationStatus } from '../domain/models/quotation.model';
import { QuotationRepository } from '../domain/repositories/quotation.repository';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';
import { SendNotificationUseCase } from '../../notification/useCases/sendNotification.useCase';
import { NotificationType } from '../../notification/domain/models/notification.model';
import { UserRepository } from '../../user/domain/repositories/user.repository';
import { PlanRepository } from '../../subscription/domain/repositories/plan.repository';
import {
  CreateQuotationRequest,
  QuotationResponse,
} from '../interfaces/dtos/quotation.dto';
import { QuotationRequestStatus } from '../../quotationRequest/domain/models/quotationRequest.model';

export class CreateQuotationUseCase {
  constructor(
    private quotationRepository: QuotationRepository,
    private quotationRequestRepository: QuotationRequestRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
    private userRepository: UserRepository,
    private planRepository: PlanRepository,
  ) {}

  async execute(
    data: CreateQuotationRequest,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<QuotationResponse> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;

    // 1. Validar Usuario y Plan (Límites de proveedor)
    const user = await this.userRepository.findById(effectiveOwnerId);
    if (!user || !user.planId) throw new Error('Usuario o plan no encontrado');

    const plan = await this.planRepository.findById(user.planId);
    if (!plan) throw new Error('No se pudo determinar los límites del plan');

    const startDate = user.planStartDate || new Date(2000, 0, 1);
    const currentUsage = await this.quotationRepository.countSince(
      effectiveOwnerId,
      startDate,
    );

    if (currentUsage >= plan.quotationLimit) {
      throw new Error('Has alcanzado el límite de cotizaciones para tu plan');
    }

    // 2. Validar existencia de la solicitud y duplicidad
    const request = await this.quotationRequestRepository.findById(
      data.quotationRequestId,
    );
    if (!request) throw new Error('La solicitud de cotización no existe');

    const existingQuotation =
      await this.quotationRepository.findByUserAndQuotationRequest(
        effectiveOwnerId,
        data.quotationRequestId,
      );
    if (existingQuotation)
      throw new Error(
        'Usted ya ha enviado una cotización para esta solicitud.',
      );

    // 3. Crear y Guardar
    const newQuotation = new Quotation(
      data.responseDeadline,
      data.quotationRequestId,
      effectiveOwnerId,
      data.price,
      data.deliveryTime,
      data.status || QuotationStatus.DRAFT,
      data.description,
      data.individualValues,
    );

    const saved = await this.quotationRepository.save(newQuotation);

    // 4. Actualizar el estado de la Solicitud si estaba PENDIENTE
    if (request.status === 'PENDING') {
      await this.quotationRequestRepository.update(data.quotationRequestId, {
        status: QuotationRequestStatus.QUOTED, // Dependiendo del enum exportado en backend
      });
    }

    // 5. Notificar al dueño de la solicitud (request.userId)
    await this.sendNotificationUseCase.execute(
      NotificationType.TRANSACTIONAL,
      'Nueva Cotización',
      `Has recibido una nueva oferta para tu solicitud.`,
      `/dashboard/quotations/detail/${data.quotationRequestId}`,
      request.userId,
    );

    return this.mapToResponse(saved);
  }

  private mapToResponse(q: Quotation): QuotationResponse {
    return {
      id: q.id!,
      responseDeadline: q.responseDeadline,
      quotationRequestId: q.quotationRequestId,
      userId: q.userId,
      price: q.price,
      deliveryTime: q.deliveryTime,
      description: q.description,
      status: q.status,
      individualValues: q.individualValues,
      businessName: q.businessName,
      issueDate: q.issueDate,
    };
  }
}
