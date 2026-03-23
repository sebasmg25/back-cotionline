import { QuotationRequestRepository } from '../domain/repositories/quotationRequest.repository';
import { QuotationRequestResponse } from '../interfaces/dtos/quotationRequest.dto';

export class SearchQuotationRequestsByTitleUseCase {
  constructor(private quotationRequestRepository: QuotationRequestRepository) {}

  async execute(
    title: string,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<QuotationRequestResponse[]> {
    if (!title || title.trim() === '') return [];

    const effectiveOwnerId = userSession.ownerId || userSession.id;

    await this.quotationRequestRepository.updateExpiredStatus({
      userId: effectiveOwnerId,
    });

    const results = await this.quotationRequestRepository.findByTitle(
      title,
      effectiveOwnerId,
    );

    return (results || []).map((req) => ({
      id: req.id!,
      title: req.title,
      description: req.description,
      createdAt: req.createdAt,
      responseDeadline: req.responseDeadline,
      status: req.status,
      branch: req.branch,
      userId: req.userId,
      products: req.products?.map((p) => ({
        id: p.id!,
        name: p.name,
        amount: p.amount,
        unitOfMeasurement: p.unitOfMeasurement,
        description: p.description,
        quotationRequestId: p.quotationRequestId,
      })),
    }));
  }
}
