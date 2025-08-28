import { Business } from '../domain/models/business.model';
import {
  BusinessRepository,
  BusinessUpdateFields,
} from '../domain/repositories/business.repository';

export class RegisterBusinessUseCase {
  constructor(private businessRepository: BusinessRepository) {}
  async save(
    nit: string,
    name: string,
    description: string,
    address: string,
    userId: string
  ) {
    const existNit = await this.businessRepository.findByNit(nit);

    if (existNit) {
      throw new Error('Ya existe un negocio registrado con este nit');
    }

    const saveBusiness = new Business(nit, name, description, address, userId);
    const savedBusiness = await this.businessRepository.save(saveBusiness);

    return savedBusiness;
  }

  async update(
    id: string,
    nit?: string,
    name?: string,
    description?: string,
    address?: string
  ): Promise<Business | null> {
    const existBusiness = await this.businessRepository.findById(id);
    if (!existBusiness) {
      throw new Error('El negocio que intentas actualizar no existe.');
    }

    if (nit && nit !== existBusiness.nit) {
      const existNit = await this.businessRepository.findByNit(nit);
      if (existNit) {
        throw new Error('Ya existe otro negocio registrado con este nit.');
      }
    }

    const updateFields: BusinessUpdateFields = {};
    let hasChanges = false;
    if (nit !== undefined && nit !== existBusiness.nit) {
      updateFields.nit = nit;
      hasChanges = true;
    }
    if (name !== undefined && name !== existBusiness.name) {
      updateFields.name = name;
      hasChanges = true;
    }
    if (
      description !== undefined &&
      description !== existBusiness.description
    ) {
      updateFields.description = description;
      hasChanges = true;
    }
    if (address !== undefined && address !== existBusiness.address) {
      updateFields.address = address;
      hasChanges = true;
    }

    if (!hasChanges) {
      throw new Error('No se detectaron cambios en los campos enviados.');
    }
    const updatedBusiness = await this.businessRepository.update(
      id,
      updateFields
    );
    return updatedBusiness;
  }

  async delete(id: string): Promise<Business | null> {
    const existBusiness = await this.businessRepository.findById(id);
    if (!existBusiness) {
      throw new Error('El negocio que quieres eliminar no existe');
    }
    const deletedResult = await this.businessRepository.delete(id);

    if (!deletedResult) {
      return null;
    }
    return existBusiness;
  }
}
