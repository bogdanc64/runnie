import { Asset } from "runnie-common"
import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { TestEntity } from "./test.entity";
import { OrganizationEntity } from "./organization.entity";

@Entity({ tableName: "assets" })
export class AssetEntity extends BaseEntity implements Asset {

    @Property()
    name: string;

    @Property()
    website: string;

    @OneToMany(() => TestEntity, test => test.asset)
    tests: TestEntity[];

    @ManyToOne(() => OrganizationEntity)
    organization: OrganizationEntity;
}
