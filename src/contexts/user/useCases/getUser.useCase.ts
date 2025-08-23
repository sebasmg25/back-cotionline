import {User} from '../domain/models/user.model';
import {UserRepository} from '../domain/repositories/user.repository';

export class GetUserUseCase {
    constructor(private userRepository: UserRepository){}

    async execute(userId: string): Promise<User>{
        const user = await this.userRepository.findById(userId);

        if(!user){
            throw new Error('Usuario no encontrado.');
        }
    return user;
    }
}
