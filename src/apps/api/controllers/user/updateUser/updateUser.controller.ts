import {Request, Response} from 'express';
import { UpdateUserUseCase } from '../../../../../contexts/user/useCases/updateUser.useCase';
import {validationResult} from 'express-validator';
import {UpdateUSerDto} from '../../../../../contexts/user/interfaces/dtos/updateUser.dto';
import {TypeORMUserRepository} from '../../../../../contexts/user/infrastructure/persistance/typeorm/typeOrmUserRepository';

export class UpdateUserController{
    private updateUserUseCase: UpdateUserUseCase;

    constructor(){
        const userRepository = new TypeORMUserRepository();
        this.updateUserUseCase = new UpdateUserUseCase(userRepository);
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try{
            const userId = req.params.id;
            const updatedData: UpdateUSerDto = req.body;

            const updatedUser = await this.updateUserUseCase.execute(userId, updatedData);

            const {password, ...userResponse} = updatedUser;
            res.status(200).json({message: 'Usuario actualizado correctamente', user: userResponse});
        } catch (error: any) {
            if (error.message === 'Usuario no encontrado.') {
                res.status(404).json({message: error.message});
            } else if (error.message === 'El nuevo correo ya esta en uso.') {
                res.status(409).json({message: error.message});
            } else {
                console.error('Error al actualizar el usuario:', error);
                res.status(500).json({message: 'Error interno del servidor'});  
            }  
        }
    }   
}