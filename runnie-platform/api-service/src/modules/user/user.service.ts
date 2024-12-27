import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/database/entities/user.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class UserService extends BaseService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        public em: EntityManager
    ) {
        super(userRepository, em);
    }

    async getByEmail(email: string): Promise<UserEntity> {
        return this.findOneWithPopulate({ 
            email: { $eq: email },
            deleted: { $eq: false }
        });
    }

    async getByEmailToken(token: string): Promise<UserEntity> {
        return this.findOneWithPopulate({ 
            confirmEmailToken: { $eq: token },
        });
    }

    async getByResetPassowrdToken(token: string): Promise<UserEntity> {
        return this.findOneWithPopulate({ 
            resetPasswordToken: { $eq: token }
        });
    }
}
