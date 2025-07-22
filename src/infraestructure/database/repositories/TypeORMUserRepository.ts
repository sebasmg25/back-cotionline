import { Repository, UpdateResult } from 'typeorm';
import { User } from '../../../domain/models/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { AppDataSource } from '../../../config/database';
import { UserEntity } from '../entities/UserEntity';
const bcrypt = require('bcrypt');

interface UserUpdateFields {
  identification?: string;
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  city?: string;
}

export class TypeORMUserRepository implements UserRepository {
  private ormRepository: Repository<UserEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserEntity);
  }

  async save(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userToSave = this.ormRepository.create({
      ...user,
      password: hashedPassword,
    });

    const savedEntity = await this.ormRepository.save(userToSave);
    console.log('USUARIO', savedEntity);

    return new User(
      savedEntity.identification,
      savedEntity.name,
      savedEntity.lastName,
      savedEntity.email,
      savedEntity.password,
      savedEntity.city,
      savedEntity.id
    );
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.ormRepository.findOne({
      where: { id },
    });
    if (!userEntity) {
      return null;
    }
    return new User(
      userEntity.identification,
      userEntity.name,
      userEntity.lastName,
      userEntity.email,
      userEntity.password,
      userEntity.city,
      userEntity.id
    );
  }

  async findByIdentification(identification: string): Promise<User | null> {
    const userEntity = await this.ormRepository.findOne({
      where: { identification },
    });
    if (!userEntity) {
      return null;
    }
    return new User(
      userEntity.identification,
      userEntity.name,
      userEntity.lastName,
      userEntity.email,
      userEntity.password,
      userEntity.city,
      userEntity.id
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.ormRepository.findOne({ where: { email } });
    if (!userEntity) {
      return null;
    }
    return new User(
      userEntity.identification,
      userEntity.name,
      userEntity.lastName,
      userEntity.email,
      userEntity.password,
      userEntity.city,
      userEntity.id
    );
  }

  async update(id: string, updates: UserUpdateFields): Promise<User | null> {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updateResult: UpdateResult = await this.ormRepository.update(
      id,
      updates
    );

    if (updateResult.affected === 0) {
      return null;
    }

    const updateUserEntity = await this.ormRepository.findOne({
      where: { id },
    });

    if (!updateUserEntity) {
      return null;
    }

    return new User(
      updateUserEntity.identification,
      updateUserEntity.name,
      updateUserEntity.lastName,
      updateUserEntity.email,
      updateUserEntity.password,
      updateUserEntity.city,
      updateUserEntity.id
    );
  }

  async delete(id: string): Promise<User | null> {
    const userEntity = await this.ormRepository.findOne({ where: { id } });
    if (!userEntity) {
      return null;
    }
    const deleteUser = await this.ormRepository.delete(id);

    if (deleteUser.affected === 0) {
      console.log(
        `Error: No se pudo eliminar el usuario con ID ${id} a pesar de haberlo encontrado.`
      );
    }
    return new User(
      userEntity.identification,
      userEntity.name,
      userEntity.lastName,
      userEntity.email,
      userEntity.password,
      userEntity.city,
      userEntity.id
    );
  }
}

//prueba
