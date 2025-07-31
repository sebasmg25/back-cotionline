import { User } from '../models/user.model';

interface UserUpdateFields {
  identification?: string;
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  city?: string;
}
export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByIdentification(identification: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, updates: UserUpdateFields): Promise<User | null>;
  delete(id: string): Promise<User | null>;
}
