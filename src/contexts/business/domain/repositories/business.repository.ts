import { Business } from '../models/business.model';

export interface BusinessUpdateFields {
  nit?: string;
  name?: string;
  description?: string;
  address?: string;
}

export interface BusinessRepository {
  save(business: Business): Promise<Business>;
  findById(id: string): Promise<Business | null>;
  findByNit(nit: string): Promise<Business | null>;
  update(
    id: string,
    businessUpdateFields: BusinessUpdateFields
  ): Promise<Business | null>;
  delete(id: string): Promise<Business | null>;
}
