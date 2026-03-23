import { Quotation } from '../domain/models/quotation.model';
import { QuotationRepository } from '../domain/repositories/quotation.repository';
import { QuotationResponse } from '../interfaces/dtos/quotation.dto';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class CompareQuotationsUseCase {
  constructor(
    private quotationRepository: QuotationRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(
    quotationRequestId: string,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<{ cheaper: QuotationResponse; faster: QuotationResponse }> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;

    const request =
      await this.quotationRequestRepository.findById(quotationRequestId);
    if (!request || request.userId !== effectiveOwnerId) {
      throw new Error('No tienes permiso para comparar estas cotizaciones.');
    }

    const quotations =
      await this.quotationRepository.findByQuotationRequestId(
        quotationRequestId,
      );
    if (quotations.length === 0)
      throw new Error('No hay cotizaciones para esta solicitud');

    let bestPrice = quotations[0];
    let bestDelivery = quotations[0];

    for (let i = 1; i < quotations.length; i++) {
      if (quotations[i].price < bestPrice.price) bestPrice = quotations[i];
      if (quotations[i].deliveryTime < bestDelivery.deliveryTime)
        bestDelivery = quotations[i];
    }

    return {
      cheaper: this.mapToResponse(bestPrice),
      faster: this.mapToResponse(bestDelivery),
    };
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
      businessName: q.businessName,
      issueDate: q.issueDate,
    };
  }
}
