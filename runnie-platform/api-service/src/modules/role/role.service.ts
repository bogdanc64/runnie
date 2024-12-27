import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/database/entities/role.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class RoleService extends BaseService<RoleEntity> {
    constructor(
        @InjectRepository(RoleEntity)
        public readonly roleRepository: EntityRepository<RoleEntity>,
        public readonly em: EntityManager
    ) {
        super(roleRepository, em);
    }
}
