import { QuotationRepository } from '../domain/repositories/quotation.repository';
import { QuotationResponse } from '../interfaces/dtos/quotation.dto';
import { QuotationRequestRepository } from '../../quotationRequest/domain/repositories/quotationRequest.repository';

export class GetAllQuotationsByUserIdUseCase {
  constructor(
    private quotationRepository: QuotationRepository,
    private quotationRequestRepository: QuotationRequestRepository,
  ) {}

  async execute(userSession: {
    id: string;
    role: string;
    ownerId?: string;
  }): Promise<any[]> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;
    const quotations =
      await this.quotationRepository.findAllByUserId(effectiveOwnerId);

    const detailedQuotations = await Promise.all(
      quotations.map(async (q) => {
        const request = await this.quotationRequestRepository.findById(
          q.quotationRequestId,
        );
        return {
          ...this.mapToResponse(q),
          requestTitle: request?.title || 'Solicitud sin título',
          createdAt: (q as any).issueDate,
        };
      }),
    );

    return detailedQuotations;
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
