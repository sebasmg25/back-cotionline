import { BusinessRepository } from '../domain/repositories/business.repository';
import { BusinessResponse } from '../interfaces/dtos/business.dto';

export class DeleteBusinessUseCase {
  constructor(private businessRepository: BusinessRepository) {}

  async execute(
    businessId: string,
    userIdSession: string,
  ): Promise<BusinessResponse> {

    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Negocio no encontrado.');
    }


    if (business.userId !== userIdSession) {
      throw new Error('No tienes permiso para acceder a este negocio.');
    }


    const deleted = await this.businessRepository.delete(businessId);
    if (!deleted) {
      throw new Error('No se pudo eliminar el negocio de la base de datos.');
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
