import { QuotationStatus } from '../../domain/models/quotation.model';

export interface CreateQuotationRequest {
  quotationRequestId: string;
  responseDeadline: Date;
  price: number;
  deliveryTime: Date;
  status: QuotationStatus;
  individualValues: any[];
  description?: string;
}

export interface UpdateQuotationRequest {
  responseDeadline?: Date;
  price?: number;
  deliveryTime?: Date;
  status?: QuotationStatus;
  individualValues?: any[];
  description?: string;
}

export interface QuotationResponse {
  id: string;
  responseDeadline: Date;
  quotationRequestId: string;
  userId: string;
  price: number;
  deliveryTime: Date;
  description?: string;
  status: QuotationStatus;
  individualValues?: any[];
  businessName?: string;
  issueDate: Date;
}
