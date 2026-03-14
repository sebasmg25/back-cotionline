import { QuotationRequestRepository } from '../domain/repositories/quotationRequest.repository';
import { QuotationRequestResponse } from '../interfaces/dtos/quotationRequest.dto';

export class GetAllQuotationRequestsByUserIdUseCase {
  constructor(private quotationRequestRepository: QuotationRequestRepository) {}

  async execute(userSession: {
    id: string;
    role: string;
    ownerId?: string;
  }): Promise<QuotationRequestResponse[]> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;

    // Sincronizamos todas las del dueño real
    await this.quotationRequestRepository.updateExpiredStatus({
      userId: effectiveOwnerId,
    });

    const requests =
      await this.quotationRequestRepository.findQuotationRequestsByUserId(
        effectiveOwnerId,
      );

    return (requests || []).map((req) => ({
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
