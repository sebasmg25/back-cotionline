import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateBranchUseCase } from "../../../../../contexts/branch/useCases/createBranch.useCase";
import { TypeORMBranchRepository } from "../../../../../contexts/branch/infrastructure/persistance/typeorm/typeOrmBranchRepository";
import { CreateBranchDto } from "../../../../../contexts/branch/interfaces/dtos/createBranch.dto";

export class CreateBranchController {
    private createBranchUseCase: CreateBranchUseCase;

    
    constructor(){
        const branchRepository = new TypeORMBranchRepository();
        this.createBranchUseCase = new CreateBranchUseCase(branchRepository);
    }
    async createBranch(req: Request, res: Response): Promise<void>{
        try{
            const{name, address, city, business} = req.body;
            const saveBranch = await this.createBranchUseCase.save(name, address, city, business);

            res.status(200).json({message: 'BRANCH', saveBranch});
        }catch(error: any){
            console.log('Error al crear la sede', error);

            if(error.message.includes('ya registrado')){
                res.status(409).json({message: error.message});
            }else{
                res.status(500).json({message: 'Error interno del servidor'});
            }
        }
    }
}