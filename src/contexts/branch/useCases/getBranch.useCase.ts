
import { Branch } from '../../branch/domain/models/branch.model';
import { BranchRepository } from '../../branch/domain/repositories/branch.repository';

export class GetBranchUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(branchId: string): Promise<Branch> {
    const branch = await this.branchRepository.findById(branchId);
    
    if (!branch) {
      throw new Error('Branch not found.');
    }

    return branch;
  }
}