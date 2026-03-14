import { Business, BusinessStatus } from '../domain/models/business.model';
import { BusinessRepository } from '../domain/repositories/business.repository';
import {
  CreateBusinessRequest,
  BusinessResponse,
} from '../interfaces/dtos/business.dto';

export class RegisterBusinessUseCase {
  constructor(private businessRepository: BusinessRepository) {}

  async execute(
    data: CreateBusinessRequest,
    userIdSession: string,
  ): Promise<BusinessResponse> {
    const existNit = await this.businessRepository.findByNit(data.nit);
    if (existNit)
      throw new Error('Ya existe un negocio registrado con este nit');

    const newBusiness = new Business(
      data.nit,
      data.name,
      data.description,
      data.address,
      userIdSession, // ID del token
      BusinessStatus.PENDING,
      data.rutUrl,
      data.chamberOfCommerceUrl,
    );

    const saved = await this.businessRepository.save(newBusiness);
    return this.mapToResponse(saved);
  }

  private mapToResponse(business: Business): BusinessResponse {
    return {
      id: business.id!,
      nit: business.nit,
      name: business.name,
      description: business.description,
      address: business.address,
      userId: business.userId,
      status: business.status,
      rutUrl: business.rutUrl,
      chamberOfCommerceUrl: business.chamberOfCommerceUrl,
    };
  }
}
