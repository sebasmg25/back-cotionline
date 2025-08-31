import {User} from '../domain/models/user.model';
import {UserRepository, UserUpdateFields} from '../domain/repositories/user.repository';

export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository){}

    async update(id: string, name?:string, lastName?: string, city?: string): Promise<User | null>{
        const existingUser = await this.userRepository.findById(id);
        if(!existingUser){
            throw new Error("El usuario que intentas actualizar no existe");
        }

        const updateFields: UserUpdateFields = {};
        let hasChanges = false;
        if (name !== undefined && name !== existingUser.name){
        updateFields.name = name;
        hasChanges = true;
        }

        if (lastName !== undefined && lastName !== existingUser.lastName){
        updateFields.lastName = lastName;
        hasChanges = true;
        }
        if (city !== undefined && city !== existingUser.city){
        updateFields.city = city;
        hasChanges = true;
        }

        if (!hasChanges){
            throw new Error('No se detectaron cambios en los campos enviados.');
        }
        const updateUser = await this.userRepository.update(id, updateFields);
        return updateUser;
    }
    
}
