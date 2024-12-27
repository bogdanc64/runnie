import { Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { Permission, PermissionResource, PermissionAction } from 'runnie-common';
import { RoleEntity } from './role.entity';

@Entity({ tableName: "permissions" })
export class PermissionEntity extends BaseEntity implements Permission {
    @Property()
    resource: PermissionResource;
    
    @Property()
    action: PermissionAction;
    
    @ManyToMany(() => RoleEntity, role => role.permissions)
    roles: RoleEntity[];
}
