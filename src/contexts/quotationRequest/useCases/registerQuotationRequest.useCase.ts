import { QuotationRequest } from '../domain/models/quotationRequest.model';
import { QuotationRequestRepository } from '../domain/repositories/quotationRequest.repository';
import { QuotationRequestDto } from '../interfaces/dtos/quotationRequestResponse.dto';

export class RegisterQuotationRequestUseCase {
  constructor(private quotationRequestRepository: QuotationRequestRepository) {}
  async save(
    quotationRequestDto: QuotationRequestDto
  ): Promise<QuotationRequest> {
    const saveQuotationRequest = new QuotationRequest(
      quotationRequestDto.responseDeadline,
      quotationRequestDto.status,
      quotationRequestDto.branch,
      quotationRequestDto.userId
    );

    const savedQuotationRequest = await this.quotationRequestRepository.save(
      saveQuotationRequest
    );
    return savedQuotationRequest;
  }
}
