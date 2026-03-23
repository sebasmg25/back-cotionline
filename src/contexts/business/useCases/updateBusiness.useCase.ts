import {
  BusinessRepository,
  BusinessUpdateFields,
} from '../domain/repositories/business.repository';
import {
  UpdateBusinessRequest,
  BusinessResponse,
} from '../interfaces/dtos/business.dto';

export class UpdateBusinessUseCase {
  constructor(private businessRepository: BusinessRepository) {}

  async execute(
    id: string,
    data: UpdateBusinessRequest,
    userIdSession: string,
  ): Promise<BusinessResponse> {
    const existBusiness = await this.businessRepository.findById(id);
    if (!existBusiness)
      throw new Error('El negocio que intentas actualizar no existe.');

    if (existBusiness.userId !== userIdSession) {
      throw new Error('No tienes permiso para modificar este negocio.');
    }

    const updateFields: BusinessUpdateFields = {};

    if (data.nit && data.nit !== existBusiness.nit) {
      const existNit = await this.businessRepository.findByNit(data.nit);
      if (existNit)
        throw new Error('Ya existe otro negocio registrado con este nit.');
      updateFields.nit = data.nit;
    }

    if (data.name) updateFields.name = data.name;
    if (data.description) updateFields.description = data.description;
    if (data.address) updateFields.address = data.address;

    if (data.rutUrl) updateFields.rutUrl = data.rutUrl;
    if (data.chamberOfCommerceUrl)
      updateFields.chamberOfCommerceUrl = data.chamberOfCommerceUrl;
    if (Object.keys(updateFields).length === 0) {
      throw new Error('No se detectaron cambios en los campos enviados.');
    }

    const updated = await this.businessRepository.update(id, updateFields);
    if (!updated) throw new Error('Error al actualizar el negocio.');

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
