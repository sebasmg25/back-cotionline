import { Branch } from '../domain/models/branch.model';
import { BranchRepository } from '../domain/repositories/branch.repository';
import { BusinessRepository } from '../../business/domain/repositories/business.repository';
import { BranchResponse } from '../interfaces/dtos/branch.dto';

export class GetBranchUseCase {
  constructor(
    private branchRepository: BranchRepository,
    private businessRepository: BusinessRepository, // Para validar el dueño
  ) {}

  async execute(
    branchId: string,
    userIdSession: string,
  ): Promise<BranchResponse> {
    // 1. Buscar la sede
    const branch = await this.branchRepository.findById(branchId);

    if (!branch) {
      throw new Error('Sede no encontrada.');
    }

    // 2. Validar que el usuario sea el dueño del negocio al que pertenece la sede
    const business = await this.businessRepository.findById(branch.businessId);

    if (!business || business.userId !== userIdSession) {
      throw new Error('No tienes permiso para ver esta sede.');
    }

    return {
      id: branch.id!,
      name: branch.name,
      address: branch.address,
      city: branch.city,
      businessId: branch.businessId,
    };
  }
}
