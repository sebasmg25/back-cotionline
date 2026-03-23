import {
  QuotationRepository,
  QuotationUpdateFields,
} from '../domain/repositories/quotation.repository';
import {
  UpdateQuotationRequest,
  QuotationResponse,
} from '../interfaces/dtos/quotation.dto';

export class UpdateQuotationUseCase {
  constructor(private quotationRepository: QuotationRepository) {}

  async execute(
    id: string,
    userSession: { id: string; role: string; ownerId?: string },
    data: UpdateQuotationRequest,
  ): Promise<QuotationResponse> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;
    const existQuotation = await this.quotationRepository.findById(id);
    if (!existQuotation)
      throw new Error('La cotización que intentas actualizar no existe');

    if (existQuotation.userId !== effectiveOwnerId) {
      throw new Error('No tienes permiso para editar esta cotización.');
    }

    const updateFields: QuotationUpdateFields = {};
    let hasChanges = false;

    if (
      data.responseDeadline &&
      data.responseDeadline.getTime() !==
        existQuotation.responseDeadline.getTime()
    ) {
      updateFields.responseDeadline = data.responseDeadline;
      hasChanges = true;
    }
    if (data.price !== undefined && data.price !== existQuotation.price) {
      updateFields.price = data.price;
      hasChanges = true;
    }
    if (
      data.deliveryTime &&
      data.deliveryTime.getTime() !== existQuotation.deliveryTime.getTime()
    ) {
      updateFields.deliveryTime = data.deliveryTime;
      hasChanges = true;
    }
    if (
      data.description !== undefined &&
      data.description !== existQuotation.description
    ) {
      updateFields.description = data.description;
      hasChanges = true;
    }
    if (data.status !== undefined && data.status !== existQuotation.status) {
      updateFields.status = data.status;
      hasChanges = true;
    }
    if (data.individualValues !== undefined) {
      updateFields.individualValues = data.individualValues;
      hasChanges = true;
    }

    if (!hasChanges)
      throw new Error('No se detectaron cambios en los campos enviados.');

    const updated = await this.quotationRepository.update(id, updateFields);
    if (!updated) throw new Error('Error técnico al actualizar.');

    return {
      id: updated.id!,
      responseDeadline: updated.responseDeadline,
      quotationRequestId: updated.quotationRequestId,
      userId: updated.userId,
      price: updated.price,
      deliveryTime: updated.deliveryTime,
      description: updated.description,
      status: updated.status,
      individualValues: updated.individualValues,
      businessName: updated.businessName,
      issueDate: updated.issueDate,
    };
  }
}
