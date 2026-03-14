import { QuotationRequestStatus } from '../../domain/models/quotationRequest.model';
import { ProductResponse } from '../../../product/interfaces/dtos/product.dto';

export interface CreateQuotationRequestDto {
  title: string;
  description?: string;
  responseDeadline: Date;
  branch: string;
  status?: QuotationRequestStatus; // Añadido para recibir DRAFT o PENDING
}

export interface UpdateQuotationRequestDto {
  title?: string;
  description?: string;
  responseDeadline?: Date;
  branch?: string;
  status?: QuotationRequestStatus; // Añadido para poder publicar un borrador existente
}

export interface QuotationRequestResponse {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  responseDeadline: Date;
  status: QuotationRequestStatus;
  branch: string;
  branchName?: string;
  userId: string;
  products?: ProductResponse[];
}
