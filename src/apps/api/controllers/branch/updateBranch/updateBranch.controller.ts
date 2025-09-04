
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateBranchUseCase } from '../../../../../contexts/branch/useCases/updateBranch.useCase';
import { TypeORMBranchRepository } from '../../../../../contexts/branch/infrastructure/persistance/typeorm/typeOrmBranchRepository';
import { UpdateBranchDto } from '../../../../../contexts/branch/interfaces/dtos/updateBranch.dto';

export class UpdateBranchController{
    private updateBranchUseCase: UpdateBranchUseCase;

    constructor(){
        const branchRepository = new TypeORMBranchRepository();
        this.updateBranchUseCase = new UpdateBranchUseCase(branchRepository);
    }

    async update(req: Request, res: Response): Promise<void> {
        try{
            const {id} = req.params;
            const { name, lastName, city} = req.body;

            if(!name && !lastName && !city){
                res.status(400).json({message: 'Al menos un campo debe ser proporcionado para la actualización.'});
                return;
        }
        const updateBranch = await this.updateBranchUseCase.update(id,name, lastName, city);
        res.status(200).json({message: 'Sede actualizada exitosamente', data: updateBranch});
        }catch(error:any){
            console.log('Error al actualizar el negocio', error);
            if(error.message.includes('No existe.')){
                res.status(404).json({message: error.message});
            }else if(error.message.includes('Ya existe')){
                res.status(409).json({message: error.message});
            }else if(error.message.includes('No se detectaron cambios en los campos enviados.')){
                res.status(400).json({message: error.message});
            }else{
                res.status(500).json({message: 'Error interno del servidor'});
            }
        }
    }
}