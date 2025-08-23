import { TypeORMUserRepository } from '../../../../../contexts/user/infrastructure/persistance/typeorm/typeOrmUserRepository';
import {GetUserUseCase} from '../../../../../contexts/user/useCases/getUser.useCase';
import {Request, Response} from 'express';

    const userRepository = new TypeORMUserRepository();
    const getUserUseCase = new GetUserUseCase(userRepository);

    export async function  GetUserController(req: Request, res: Response){
        try {
            const {id} = req.params;

            const user = await getUserUseCase.execute(id);

            const {password, ...userWithoutPassword} = user;

            res.status(200).json({user: userWithoutPassword});
        } catch (error: any) {
            if (error.message === 'Usuario no encontrado'){
                res.status(404).json({message: error.message});
            }else{
                res.status(500).json({message: 'Error interno del servidor'})
            }
            
        }
    }
