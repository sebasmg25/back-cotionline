import { Branch } from '../domain/models/branch.model';
import { BranchRepository } from '../domain/repositories/branch.repository';
import {
  CreateBranchRequest,
  BranchResponse,
} from '../interfaces/dtos/branch.dto';
import { BusinessRepository } from '../../business/domain/repositories/business.repository';

export class CreateBranchUseCase {
  constructor(
    private branchRepository: BranchRepository,
    private businessRepository: BusinessRepository,
  ) {}

  async execute(
    data: CreateBranchRequest,
    userIdSession: string,
  ): Promise<BranchResponse> {
    const business = await this.businessRepository.findById(data.businessId);

    if (!business) {
      throw new Error('El negocio especificado no existe.');
    }

    if (business.userId !== userIdSession) {
      throw new Error('No tienes permiso para agregar sedes a este negocio.');
    }
    const existingBranch = await this.branchRepository.findByName(data.name);

    if (existingBranch) {
      throw new Error('Ya existe una sede con este nombre.');
    }

    const newBranch = new Branch(
      data.name,
      data.address,
      data.city,
      data.businessId,
    );
    const savedBranch = await this.branchRepository.save(newBranch);

    return {
      id: savedBranch.id!,
      name: savedBranch.name,
      address: savedBranch.address,
      city: savedBranch.city,
      businessId: savedBranch.businessId,
    };
  }
}
