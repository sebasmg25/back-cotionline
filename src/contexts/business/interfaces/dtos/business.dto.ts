import { BusinessStatus } from '../../domain/models/business.model';

export interface CreateBusinessRequest {
  nit: string;
  name: string;
  description: string;
  address: string;
  // Los archivos URLs y el status los maneja el sistema, no el cliente directamente
  rutUrl?: string;
  chamberOfCommerceUrl?: string;
}

export interface UpdateBusinessRequest {
  nit?: string;
  name?: string;
  description?: string;
  address?: string;
  rutUrl?: string;
  chamberOfCommerceUrl?: string;
}

export interface BusinessResponse {
  id: string;
  nit: string;
  name: string;
  description: string;
  address: string;
  userId: string;
  status: BusinessStatus;
  rutUrl?: string;
  chamberOfCommerceUrl?: string;
}
