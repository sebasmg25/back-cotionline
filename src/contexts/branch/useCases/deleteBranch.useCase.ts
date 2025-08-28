
import { BranchRepository } from '../../branch/domain/repositories/branch.repository';

export class DeleteBranchUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(branchId: string): Promise<void> {
    const branchToDelete = await this.branchRepository.findById(branchId);
    
    if (!branchToDelete) {
      throw new Error('Sede no encontrada.');
    }

    await this.branchRepository.delete(branchId);
  }
}