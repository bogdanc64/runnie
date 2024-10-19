import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/database/entities/role.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: EntityRepository<Role>
    ) {}

    async getRoles(): Promise<Role[]> {
        return this.roleRepository.findAll({
            where: { deleted: { $eq: false } }
        });
    }

    async getRoleById(id: number): Promise<Role> {
        return this.roleRepository.findOne({ id });
    }
}
