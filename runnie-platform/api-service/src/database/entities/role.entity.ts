import { Entity, ManyToMany, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { Role as IRole } from "runnie-common";
import { Permission } from './permission.entity';

@Entity({ tableName: "roles" })
export class Role extends BaseEntity implements IRole {
    @Property()
    @Unique()
    name!: string;
    
    @Property({ nullable: true })
    description?: string;

    @ManyToMany(() => Permission, permission => permission.roles, { owner: true })
    permissions: Permission[];
}
