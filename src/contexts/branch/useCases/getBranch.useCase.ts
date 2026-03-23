import { Branch } from '../domain/models/branch.model';
import { BranchRepository } from '../domain/repositories/branch.repository';
import { BusinessRepository } from '../../business/domain/repositories/business.repository';
import { BranchResponse } from '../interfaces/dtos/branch.dto';

export class GetBranchUseCase {
  constructor(
    private branchRepository: BranchRepository,
    private businessRepository: BusinessRepository, 
  ) {}

  async execute(
    branchId: string,
    userIdSession: string,
  ): Promise<BranchResponse> {

    const branch = await this.branchRepository.findById(branchId);

    if (!branch) {
      throw new Error('Sede no encontrada.');
    }


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
