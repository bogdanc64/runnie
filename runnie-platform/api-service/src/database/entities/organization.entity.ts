import { Organization } from "runnie-common"
import { Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { AssetEntity } from "./asset.entity";
import { UserEntity } from "./user.entity";

@Entity({ tableName: "organizations" })
export class OrganizationEntity extends BaseEntity implements Organization {

    @OneToMany(() => AssetEntity, asset => asset.organization)
    assets: AssetEntity[];
    
    @OneToMany(() => UserEntity, user => user.organization)
    users: UserEntity[];

    @Property()
    name: string;

    @Property({ nullable: true })
    description: string;
}