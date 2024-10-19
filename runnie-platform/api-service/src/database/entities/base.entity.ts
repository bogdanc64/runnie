import { PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Model } from "runnie-common";

export abstract class BaseEntity implements Model {
    @PrimaryKey()
    @Unique()
    id!: number;

    @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
    created: Date = new Date();

    @Property({ 
        nullable: true,
        onUpdate: () => new Date() 
    })
    modified?: Date = new Date();

    @Property({ default: false })
    deleted: boolean = false;
}