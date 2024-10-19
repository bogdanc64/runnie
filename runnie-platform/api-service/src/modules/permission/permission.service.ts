import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Permission } from 'src/database/entities/permission.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: EntityRepository<Permission>
    ) {}

    async getPermissions(): Promise<Permission[]> {
        return this.permissionRepository.findAll({
            where: { deleted: { $eq: false } }
        });
    }

    async getPermissionById(id: number): Promise<Permission> {
        return this.permissionRepository.findOne({ id });
    }

    async getPermissionsByRoleName(roleName: string): Promise<Permission[]> {
        return this.permissionRepository.find({
            roles: { name: roleName }
        }, {
            populate: ['roles']
        });
    }
}
