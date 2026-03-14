import { QuotationRepository } from '../domain/repositories/quotation.repository';
import { QuotationResponse } from '../interfaces/dtos/quotation.dto';

export class GetReceivedQuotationsByUserIdUseCase {
  constructor(private quotationRepository: QuotationRepository) {}

  async execute(userSession: {
    id: string;
    role: string;
    ownerId?: string;
  }): Promise<any[]> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;
    const quotations =
      await this.quotationRepository.findReceivedByUserId(effectiveOwnerId);

    return quotations.map((q) => {
      // Usamos el requestTitle adjuntado en el repositorio o uno default
      const title = (q as any).requestTitle || 'Solicitud sin título';
      return {
        ...this.mapToResponse(q),
        requestTitle: title,
        createdAt: (q as any).issueDate, // Usamos issueDate como createdAt
      };
    });
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
