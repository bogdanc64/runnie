import { Step, StepActions } from "runnie-common"
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { TestEntity } from "./test.entity";

@Entity({ tableName: "steps" })
export class StepEntity extends BaseEntity implements Step {
    @Property()
    action: StepActions;

    @Property()
    photo: string;

    @Property()
    identifier: string;

    @Property()
    description: string;

    @ManyToOne(() => TestEntity)
    test: TestEntity;
}
