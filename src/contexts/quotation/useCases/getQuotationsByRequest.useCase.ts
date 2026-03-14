import { QuotationRepository } from '../domain/repositories/quotation.repository';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';
import { QuotationResponse } from '../interfaces/dtos/quotation.dto';

export class GetQuotationsByRequestUseCase {
  constructor(
    private quotationRepository: QuotationRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(
    quotationRequestId: string,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<QuotationResponse[]> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;

    // Validamos que el usuario logueado (o su empresa) sea el dueño de la solicitud padre
    const request =
      await this.quotationRequestRepository.findById(quotationRequestId);

    if (!request || request.userId !== effectiveOwnerId) {
      throw new Error(
        'No tienes permiso para ver las cotizaciones de esta solicitud.',
      );
    }

    const quotations =
      await this.quotationRepository.findByQuotationRequestId(
        quotationRequestId,
      );

    return (quotations || []).map((q) => ({
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
    }));
  }
}
