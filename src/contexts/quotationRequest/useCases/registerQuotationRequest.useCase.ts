import { QuotationRequest } from '../domain/models/quotationRequest.model';
import {
  QuotationRequestRepository,
  QuotationRequestUpdateFields,
} from '../domain/repositories/quotationRequest.repository';

export class RegisterQuotationRequestUseCase {
  constructor(private quotationRequestRepository: QuotationRequestRepository) {}
  async save(
    responseDeadline: Date,
    status: string,
    branch: string,
    userId: string
  ): Promise<QuotationRequest> {
    const saveQuotationRequest = new QuotationRequest(
      responseDeadline,
      status,
      branch,
      userId
    );
    const savedQuotationRequest = await this.quotationRequestRepository.save(
      saveQuotationRequest
    );
    return savedQuotationRequest;
  }

  async update(
    id: string,
    responseDeadline?: Date,
    status?: string,
    branch?: string
  ): Promise<QuotationRequest | null> {
    const existQuotationRequest =
      await this.quotationRequestRepository.findById(id);
    if (!existQuotationRequest) {
      throw new Error(
        'La solicitud de cotización que deseas actualizar no existe.'
      );
    }
    const updateFields: QuotationRequestUpdateFields = {};
    let hasChanges = false;
    if (
      responseDeadline &&
      responseDeadline !== existQuotationRequest.responseDeadline
    ) {
      updateFields.responseDeadline = responseDeadline;
      hasChanges = true;
    }

    if (status && status !== existQuotationRequest.status) {
      updateFields.status = status;
      hasChanges = true;
    }

    if (branch && branch !== existQuotationRequest.branch) {
      updateFields.branch = branch;
      hasChanges = true;
    }

    if (!hasChanges) {
      throw new Error('No se detectaron cambios en los campos enviados.');
    }

    const updatedQuotationRequest =
      await this.quotationRequestRepository.update(id, updateFields);

    return updatedQuotationRequest;
    /**
     * 1. Buscar que exista la solicitud de cotizacion en la DB.
     * 2. Validar solicitud de cotizacion.
     * 2.1 Si no existe, retornar mensaje de error.
     * 2.2 Si existe continuar con el flujo.
     * 3. Validar que el campo que se desea actualizar sea diferente al guardado en DB.
     * 3.1 Si es el mismo entonces sacar mensaje de error: El dato que desea actualizar es el mismo.
     * 3.2 Si es diferente se guarda en un objeto.
     * 4. Finalmente llamar el contrato para guardar la solicitud de cotizacion.
     *
     *
     */
  }

  async delete(id: string): Promise<QuotationRequest | null> {
    const existQuotationRequest =
      await this.quotationRequestRepository.findById(id);
    if (!existQuotationRequest) {
      throw new Error(
        'La solicitud de cotización que deseas eliminar no existe'
      );
    }
    const deletedResult = await this.quotationRequestRepository.delete(id);
    if (!deletedResult) {
      return null;
    }
    return deletedResult;
  }
}
