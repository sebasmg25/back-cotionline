import { User, UserRole } from '../models/user.model';

export interface UserUpdateFields {
  identification?: string;
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  department?: string;
  city?: string;
  planId?: string;
  planStartDate?: Date;
  role?: UserRole;
  ownerId?: string;
}
export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByIdentification(identification: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, userUpdateFields: UserUpdateFields): Promise<User | null>;
  updatePlan(
    userId: string,
    planId: string,
    isFree?: boolean,
  ): Promise<User | null>;
  delete(id: string): Promise<User | null>;
  findCollaboratorsByOwnerId(ownerId: string): Promise<User[]>;
}
