import { QuotationRequest } from '../domain/models/quotationRequest.model';
import {
  UpdateQuotationRequestDto,
  QuotationRequestResponse,
} from '../interfaces/dtos/quotationRequest.dto';
import {
  QuotationRequestRepository,
  QuotationRequestUpdateFields,
} from '../domain/repositories/quotationRequest.repository';

export class UpdateQuotationRequestUseCase {
  constructor(private quotationRequestRepository: QuotationRequestRepository) {}

  async execute(
    id: string,
    userSession: { id: string; role: string; ownerId?: string },
    data: UpdateQuotationRequestDto,
  ): Promise<QuotationRequestResponse> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;
    const existing = await this.quotationRequestRepository.findById(id);

    if (!existing || existing.userId !== effectiveOwnerId) {
      throw new Error(
        'La solicitud de cotización no existe o no tienes permiso.',
      );
    }

    const updateFields: QuotationRequestUpdateFields = {};
    let hasChanges = false;

    if (data.title && data.title !== existing.title) {
      updateFields.title = data.title;
      hasChanges = true;
    }
    if (data.branch && data.branch !== existing.branch) {
      updateFields.branch = data.branch;
      hasChanges = true;
    }
    if (data.description && data.description !== existing.description) {
      updateFields.description = data.description;
      hasChanges = true;
    }
    if (data.responseDeadline) {
      const newDate = new Date(data.responseDeadline);
      if (newDate.getTime() !== existing.responseDeadline.getTime()) {
        updateFields.responseDeadline = newDate;
        hasChanges = true;
      }
    }
    if (data.status && data.status !== existing.status) {
      updateFields.status = data.status;
      hasChanges = true;
    }

    if (!hasChanges) {
      return this.mapToResponse(existing);
    }

    const updated = await this.quotationRequestRepository.update(
      id,
      updateFields,
    );
    if (!updated) throw new Error('Error al actualizar la solicitud.');

    return this.mapToResponse(updated);
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
