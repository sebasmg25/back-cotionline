import {Request, Response} from 'express';
import {DeleteUserUseCase} from '../../../../../contexts/user/useCases/deleteUser.useCase';
import {TypeORMUserRepository} from '../../../../../contexts/user/infrastructure/persistance/typeorm/typeOrmUserRepository';

const userRepository = new TypeORMUserRepository();
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

export async function DeleteUserController(req: Request, res: Response){
    try{
        const {id} = req.params;
        await deleteUserUseCase.execute(id);
        res.status(200).json({message: 'Usuario eliminado con éxito'});
    }catch(error: any){
        if(error.message === 'Usuario no encontrado'){
            res.status(404).json({message: error.message});
        }else{
            res.status(500).json({message: 'Error interno en el servidor.'});
        }
    }
}
