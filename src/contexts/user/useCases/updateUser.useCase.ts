import {User} from '../domain/models/user.model';
import {UserRepository} from '../domain/repositories/user.repository';

export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository){}

    async execute(userId: string, updatedData: Partial<User>): Promise<User>{
        const userToUpdate = await this.userRepository.findById(userId);

        if(!userToUpdate){
            throw new Error("Usuario no encontrado.");
            
        }

    const updatedUser = Object.assign(userToUpdate, updatedData);
    
    const savedUSer = await this.userRepository.save(updatedUser);

    return savedUSer;
    }
    
}
