import {
  QuotationRequest,
  QuotationRequestStatus,
} from '../domain/models/quotationRequest.model';
import { QuotationRequestRepository } from '../domain/repositories/quotationRequest.repository';
import {
  CreateQuotationRequestDto,
  QuotationRequestResponse,
} from '../interfaces/dtos/quotationRequest.dto';
import { UserRepository } from '../../user/domain/repositories/user.repository';
import { PlanRepository } from '../../subscription/domain/repositories/plan.repository';

export class RegisterQuotationRequestUseCase {
  constructor(
    private quotationRequestRepository: QuotationRequestRepository,
    private userRepository: UserRepository,
    private planRepository: PlanRepository,
  ) {}

  async execute(
    dto: CreateQuotationRequestDto,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<QuotationRequestResponse> {

    const effectiveOwnerId = userSession.ownerId || userSession.id;

    const user = await this.userRepository.findById(effectiveOwnerId);
    if (!user || !user.planId) throw new Error('Usuario o plan no encontrado');

    const plan = await this.planRepository.findById(user.planId);
    if (!plan) throw new Error('No se pudo determinar los límites del plan');

    const startDate = user.planStartDate || new Date(2000, 0, 1);
    const currentUsage = await this.quotationRequestRepository.countSince(
      effectiveOwnerId,
      startDate,
    );

    if (currentUsage >= plan.requestLimit) {
      throw new Error('Has alcanzado el límite de solicitudes para tu plan.');
    }

    const finalDeadline = new Date(dto.responseDeadline);

    const quotationRequest = new QuotationRequest(
      dto.title,
      dto.description || '',
      finalDeadline,
      dto.status || QuotationRequestStatus.DRAFT,
      dto.branch,
      effectiveOwnerId,
    );

    const saved = await this.quotationRequestRepository.save(quotationRequest);
    return this.mapToResponse(saved);
  }

  private mapToResponse(m: QuotationRequest): QuotationRequestResponse {
    return {
      id: m.id!,
      title: m.title,
      description: m.description,
      createdAt: m.createdAt,
      responseDeadline: m.responseDeadline,
      status: m.status,
      branch: m.branch,
      userId: m.userId,
      products: m.products?.map((p) => ({
        id: p.id!,
        name: p.name,
        amount: p.amount,
        unitOfMeasurement: p.unitOfMeasurement,
        description: p.description,
        quotationRequestId: p.quotationRequestId,
      })),
    };
  }
}
