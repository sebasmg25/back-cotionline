import { Branch } from "../domain/models/branch.model";
import {  BranchRepository} from "../domain/repositories/branch.repository";

export class CreateBranchUseCase {
    constructor(private branchRepository: BranchRepository){}

    async execute(name: string, address: string, city: string, business: string): Promise<Branch>{
        const existingBranch = await this.branchRepository.findByName(name);

        if(existingBranch){
            throw new Error("Ya existe una sede con este nombre.");
            
        }

        const newBranch = new Branch(name, address, city, business);
        const savedBranch = await this.branchRepository.save(newBranch);

        return savedBranch;


    }
}