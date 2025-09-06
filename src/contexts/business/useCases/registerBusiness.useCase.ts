import { Business } from '../domain/models/business.model';
import { BusinessRepository } from '../domain/repositories/business.repository';
import { BusinessDto } from '../interfaces/dtos/business.dto';

export class RegisterBusinessUseCase {
  constructor(private businessRepository: BusinessRepository) {}
  async save(businessRequestDto: BusinessDto) {
    const { nit, name, description, address, userId } = businessRequestDto;
    const existNit = await this.businessRepository.findByNit(nit);

    if (existNit) {
      throw new Error('Ya existe un negocio registrado con este nit');
    }

    const saveBusiness = businessRequestDto.fromDto();

    const savedBusiness = await this.businessRepository.save(saveBusiness);

    return BusinessDto.toDto(savedBusiness);
  }
}
