import {
  QuotationRequest,
  QuotationRequestStatus,
} from '../models/quotationRequest.model';

export interface QuotationRequestUpdateFields {
  title?: string;
  description?: string;
  responseDeadline?: Date;
  status?: QuotationRequestStatus;
  branch?: string;
}

export interface QuotationRequestRepository {
  save(quotationRequest: QuotationRequest): Promise<QuotationRequest>;
  update(
    id: string,
    quotationRequestUpdateFields: QuotationRequestUpdateFields,
  ): Promise<QuotationRequest | null>;
  findById(id: string): Promise<QuotationRequest | null>;
  delete(id: string): Promise<QuotationRequest | null>;
  findQuotationRequestsByUserId(userId: string): Promise<QuotationRequest[]>;
  countSince(userId: string, startDate: Date): Promise<number>;
  findByTitle(title: string, userId: string): Promise<QuotationRequest[]>;
  updateExpiredStatus(filters: { userId?: string; id?: string }): Promise<void>;
  findActiveQuotationRequests(
    userIdToExclude: string,
    filters?: { department?: string; city?: string },
  ): Promise<QuotationRequest[]>;
  countActiveByBranchId(branchId: string): Promise<number>;
}
