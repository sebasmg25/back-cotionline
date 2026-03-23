import { Quotation, QuotationStatus } from '../models/quotation.model';

export interface QuotationUpdateFields {
  responseDeadline?: Date;
  price?: number;
  deliveryTime?: Date;
  description?: string;
  status?: QuotationStatus;
  individualValues?: any[];
}

export interface QuotationRepository {
  save(quotation: Quotation): Promise<Quotation>;
  update(
    id: string,
    quotationUpdateFields: QuotationUpdateFields,
  ): Promise<Quotation | null>;
  findById(id: string): Promise<Quotation | null>;
  findByUserAndQuotationRequest(
    userId: string,
    quotationRequestId: string,
  ): Promise<Quotation | null>;
  delete(id: string): Promise<Quotation | null>;
  findByQuotationRequestId(quotationRequestId: string): Promise<Quotation[]>;
  findAllByUserId(userId: string): Promise<Quotation[]>;
  findReceivedByUserId(userId: string): Promise<Quotation[]>;
  countSince(userId: string, startDate: Date): Promise<number>;
}
