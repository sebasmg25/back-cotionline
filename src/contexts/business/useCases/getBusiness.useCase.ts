import { BusinessRepository } from '../domain/repositories/business.repository';
import { BusinessResponse } from '../interfaces/dtos/business.dto';

export class GetBusinessUseCase {
  constructor(private businessRepository: BusinessRepository) {}

  async execute(
    businessId: string | undefined,
    userSession: { id: string; role: string; ownerId?: string },
  ): Promise<BusinessResponse> {
    const effectiveOwnerId = userSession.ownerId || userSession.id;
    let business;

    if (businessId) {
      business = await this.businessRepository.findById(businessId);
    } else {
      business = await this.businessRepository.findByUserId(effectiveOwnerId);
    }

    if (!business) throw new Error('Negocio no encontrado.');

    if (business.userId !== effectiveOwnerId) {
      throw new Error('No tienes permiso para acceder a este negocio.');
    }

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
