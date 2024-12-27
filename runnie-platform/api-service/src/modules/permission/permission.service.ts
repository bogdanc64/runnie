import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { PermissionEntity} from 'src/database/entities/permission.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class PermissionService extends BaseService<PermissionEntity> {
    constructor(
        @InjectRepository(PermissionEntity)
        private readonly permissionRepository: EntityRepository<PermissionEntity>,
        public em: EntityManager
    ) {
        super(permissionRepository, em);
    }

    async getPermissionsByRoleName(roleName: string): Promise<PermissionEntity[]> {
        return this.permissionRepository.find({
            roles: { name: roleName }
        }, {
            populate: ["roles"]
        });
    }
}
