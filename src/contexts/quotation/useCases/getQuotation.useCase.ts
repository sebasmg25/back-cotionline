import { QuotationRepository } from '../domain/repositories/quotation.repository';
import { QuotationResponse } from '../interfaces/dtos/quotation.dto';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class GetQuotationUseCase {
  constructor(
    private quotationRepository: QuotationRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(
    quotationId: string,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<QuotationResponse> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;
    const quotation = await this.quotationRepository.findById(quotationId);
    if (!quotation) throw new Error('Cotización no encontrada.');

    // Buscamos la solicitud padre para saber quién es el comprador
    const request = await this.quotationRequestRepository.findById(
      quotation.quotationRequestId,
    );

    // Blindaje de doble vía
    const isProvider = quotation.userId === effectiveOwnerId;
    const isBuyer = request?.userId === effectiveOwnerId;

    if (!isProvider && !isBuyer) {
      throw new Error('No tienes permiso para ver esta cotización.');
    }

    return this.mapToResponse(quotation);
  }

  private mapToResponse(q: any): QuotationResponse {
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
