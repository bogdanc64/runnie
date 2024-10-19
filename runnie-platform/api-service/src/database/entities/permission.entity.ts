import { Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { Permission as IPermission, PermissionResource, PermissionAction } from 'runnie-common';
import { Role } from './role.entity';

@Entity({ tableName: "permissions" })
export class Permission extends BaseEntity implements IPermission {
    @Property()
    resource!: PermissionResource;
    
    @Property()
    action!: PermissionAction;
    
    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];
}
