import { User } from '../../domain/models/user.model';

// Definimos una interfaz para el contrato de salida (lo que ve el Frontend)
export interface UserResponse {
  id: string;
  identification: string;
  name: string;
  lastName: string;
  email: string;
  department: string;
  city: string;
  role: string;
  planId?: string;
  planStartDate?: Date;
}

export interface CreateUserRequest {
  identification: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  city: string;
}

export interface UpdateUserRequest {
  name?: string;
  lastName?: string;
  department?: string;
  city?: string;
  password?: string;
}

export class UserResponseDto {
  // A DTO: Entra el modelo de dominio -> Sale el contrato de respuesta limpio
  static toDto(model: User): UserResponse {
    return {
      id: model.id || '',
      identification: model.identification,
      name: model.name,
      lastName: model.lastName,
      email: model.email,
      department: model.department,
      city: model.city,
      role: model.role,
      planId: model.planId,
      planStartDate: model.planStartDate,
    };
  }
}
