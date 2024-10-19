import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { User as IUser } from 'runnie-common';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,
        private readonly em: EntityManager
    ) {}

    async getUsers(): Promise<User[]> {
        return this.userRepository.findAll({
            where: { deleted: { $eq: false } }
        });
    }
    // TODO: Find a cleaner way to use the soft-delete.
    async getByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ 
            email: { $eq: email },
            deleted: { $eq: false }
         });
    }

    async getById(id: number): Promise<User> {
        return this.userRepository.findOne({ id });
    }

    async getByEmailToken(token: string): Promise<User> {
        return this.userRepository.findOne({ 
            confirmEmailToken: { $eq: token },
         });
    }

    async getByResetPassowrdToken(token: string): Promise<User> {
        return this.userRepository.findOne({ 
            resetPasswordToken: { $eq: token }
         });
    }

    async upsertUser(user: Partial<IUser>): Promise<User> {
        const result = await this.userRepository.upsert(user);
        await this.em.flush();
        return result;
    }

    createUserEntity(user: Partial<IUser>): User {
        return this.userRepository.create(user);
    }
}
