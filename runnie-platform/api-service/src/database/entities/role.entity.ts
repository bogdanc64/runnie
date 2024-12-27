import { Entity, ManyToMany, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { Role } from "runnie-common";
import { PermissionEntity } from './permission.entity';

@Entity({ tableName: "roles" })
export class RoleEntity extends BaseEntity implements Role {
    @Property()
    @Unique()
    name: string;
    
    @Property({ nullable: true })
    description?: string;

    @ManyToMany(() => PermissionEntity, permission => permission.roles, { owner: true })
    permissions: PermissionEntity[];
}
