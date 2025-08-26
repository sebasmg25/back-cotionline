import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CreateBranchUseCase } from "../../../../../contexts/branch/useCases/createBranch.useCase";
import { TypeORMBranchRepository } from "../../../../../contexts/branch/infrastructure/persistance/typeorm/typeOrmBranchRepository";
import { CreateBranchDto } from "../../../../../contexts/branch/interfaces/dtos/createBranch.dto";

const branchRepository = new TypeORMBranchRepository();
const createBranchUseCase = new CreateBranchUseCase(branchRepository);

export async function CreateBranchController(req: Request<any, any, CreateBranchDto>, res: Response){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    try{
        const {name, address, city, business} = req.body;
        const newSede = await createBranchUseCase.execute(name, address, city, business);

        res.status(201).json({message: 'Sede creada exitosamente', sede: newSede});
    }catch(error:any){
        if(error.message === 'Ya existe una sede con este nombre.'){
            return res.status(409).json({message: error.message});
        }
        console.error('Error al crear la sede:', error);
        return res.status(500).json({message: 'Error interno del servidor.'});
    }

}