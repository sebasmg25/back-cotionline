import { QuotationRequestRepository } from '../domain/repositories/quotationRequest.repository';
import { QuotationRequestResponse } from '../interfaces/dtos/quotationRequest.dto';

export class DeleteQuotationRequestUseCase {
  constructor(private quotationRequestRepository: QuotationRequestRepository) {}

  async execute(
    id: string,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<QuotationRequestResponse> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;
    const existRequest = await this.quotationRequestRepository.findById(id);

    if (!existRequest) {
      throw new Error(
        'La solicitud de cotización que deseas eliminar no existe',
      );
    }

    if (existRequest.userId !== effectiveOwnerId) {
      throw new Error('No tienes permiso para eliminar esta solicitud.');
    }

    await this.quotationRequestRepository.delete(id);

    return {
      id: existRequest.id!,
      title: existRequest.title,
      description: existRequest.description,
      createdAt: existRequest.createdAt,
      responseDeadline: existRequest.responseDeadline,
      status: existRequest.status,
      branch: existRequest.branch,
      userId: existRequest.userId,
    };
  }
}
