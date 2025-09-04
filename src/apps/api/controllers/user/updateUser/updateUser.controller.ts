import {Request, Response} from 'express';
import { UpdateUserUseCase } from '../../../../../contexts/user/useCases/updateUser.useCase';
import {TypeORMUserRepository} from '../../../../../contexts/user/infrastructure/persistance/typeorm/typeOrmUserRepository';

export class UpdateUserController{
    private updateUserUseCase: UpdateUserUseCase;

    constructor(){
        const userRepository = new TypeORMUserRepository();
        this.updateUserUseCase = new UpdateUserUseCase(userRepository);
    }

    async update(req: Request, res: Response): Promise<void> {
        try{
            const {id} = req.params;
            const {name, lastName, city} = req.body;

            if(!name && !lastName && !city){
                res.status(400).json({message: 'Al menos un campo debe ser proporcionado para la actualización.'});
                return;
        }
        const updateUser = await this.updateUserUseCase.update(id, name, lastName, city);
        res.status(200).json({message: 'Usuario actualizado exitosamente', data: updateUser});
        }catch(error:any){
            console.log('Error al actualizar el usuario', error);
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