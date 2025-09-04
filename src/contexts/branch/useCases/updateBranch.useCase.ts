import { Branch } from "../domain/models/branch.model";
import { BranchRepository, BranchUpdateFields } from "../domain/repositories/branch.repository";

export class UpdateBranchUseCase {
    constructor(private branchRepository: BranchRepository){}


    async update(id: string, name?:string, address?: string, city?: string): Promise<Branch | null>{
            const existBranch = await this.branchRepository.findById(id);
            if(!existBranch){
                throw new Error("El usuario que intentas actualizar no existe");
            }
    
            const updateFields: BranchUpdateFields = {};
            let hasChanges = false;
            if (name !== undefined && name !== existBranch.name){
            updateFields.name = name;
            hasChanges = true;
            }
    
            if (address !== undefined && address !== existBranch.address){
            updateFields.address = address;
            hasChanges = true;
            }
            if (city !== undefined && city !== existBranch.city){
            updateFields.city = city;
            hasChanges = true;
            }
    
            if (!hasChanges){
                throw new Error('No se detectaron cambios en los campos enviados.');
            }
            const updateUser = await this.branchRepository.update(id, updateFields);
            return updateUser;
        }
}