import { Branch } from "../domain/models/branch.model";
import { BranchRepository } from "../domain/repositories/branch.repository";

export class UpdateBranchUseCase {
    constructor(private branchRepository: BranchRepository){}


    async execute(branchId: string, updatedData: Partial<Branch>): Promise<Branch>{
        const branchToUpdate = await this.branchRepository.findById(branchId);

        if(!branchToUpdate){
            throw new Error('Sede no encontrada');
        }

        if(updatedData.name && updatedData.name !== branchToUpdate.name){
            const existingBranchWithName = await this.branchRepository.findByName(updatedData.name);
            if(existingBranchWithName && existingBranchWithName.id !== branchToUpdate.id){
                throw new Error('El nombre que deseas actualizar, ya está en uso.');
            }
        }

        const updatedBranch = Object.assign(branchToUpdate, updatedData);
        const savedBranch = await this.branchRepository.save(updatedBranch);

        return savedBranch
    }
}