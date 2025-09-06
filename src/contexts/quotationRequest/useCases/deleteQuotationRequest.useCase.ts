import { QuotationRequest } from '../domain/models/quotationRequest.model';
import { QuotationRequestRepository } from '../domain/repositories/quotationRequest.repository';

export class DeleteQuotationRequestUseCase {
  constructor(private quotationRequestRepository: QuotationRequestRepository) {}

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
