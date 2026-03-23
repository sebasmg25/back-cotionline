import { Quotation } from '../domain/models/quotation.model';
import { QuotationRepository } from '../domain/repositories/quotation.repository';
import { QuotationResponse } from '../interfaces/dtos/quotation.dto';

export class DeleteQuotationUseCase {
  constructor(private quotationRepository: QuotationRepository) {}

  async execute(
    id: string,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<QuotationResponse> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;
    const quotation = await this.quotationRepository.findById(id);

    if (!quotation) throw new Error('Cotización no encontrada');

    if (quotation.userId !== effectiveOwnerId) {
      throw new Error('No tienes permiso para eliminar esta cotización.');
    }

    await this.quotationRepository.delete(id);
    return this.mapToResponse(quotation);
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
      issueDate: q.issueDate,
    };
  }
}
