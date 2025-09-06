import { Business } from '../domain/models/business.model';
import { BusinessRepository } from '../domain/repositories/business.repository';

export class DeleteBusinessUseCase {
  constructor(private businessRepository: BusinessRepository) {}

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
