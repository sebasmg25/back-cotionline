import { BusinessRepository } from '../domain/repositories/business.repository';
import { BusinessStatus } from '../domain/models/business.model';
import { BusinessResponse } from '../interfaces/dtos/business.dto';

export class VerifyBusinessUseCase {
  constructor(private businessRepository: BusinessRepository) {}

  async execute(
    id: string,
    newStatus: BusinessStatus,
  ): Promise<BusinessResponse> {
    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw new Error('Negocio no encontrado');
    }

    const updated = await this.businessRepository.update(id, {
      status: newStatus,
    });

    if (!updated) {
      throw new Error('Error al actualizar el estado del negocio.');
    }

    return {
      id: updated.id!,
      nit: updated.nit,
      name: updated.name,
      description: updated.description,
      address: updated.address,
      userId: updated.userId,
      status: updated.status,
      rutUrl: updated.rutUrl,
      chamberOfCommerceUrl: updated.chamberOfCommerceUrl,
    };
  }
}
