import { QuotationRequest } from '../models/quotationRequest.model';

export interface QuotationRequestUpdateFields {
  responseDeadline?: Date;
  status?: string;
  branch?: string;
}

export interface QuotationRequestRepository {
  save(quotationRequest: QuotationRequest): Promise<QuotationRequest>;
  update(
    id: string,
    quotattionRequestUpdateFields: QuotationRequestUpdateFields
  ): Promise<QuotationRequest | null>;
  findById(id: string): Promise<QuotationRequest | null>;
  delete(id: string): Promise<QuotationRequest | null>;
}
