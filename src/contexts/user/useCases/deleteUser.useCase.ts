import {UserRepository} from '../domain/repositories/user.repository';

export class DeleteUserUseCase{
    constructor(private userRepository: UserRepository){}

    async execute(userId: string): Promise<void>{
        const userToDelete = await this.userRepository.findById(userId);

        if(!userToDelete){
            throw new Error('Usuario no encontrado');
        }

        await this.userRepository.delete(userId);

    }

}