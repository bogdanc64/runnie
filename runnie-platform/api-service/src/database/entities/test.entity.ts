import { Test } from "runnie-common"
import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { AssetEntity } from "./asset.entity";
import { TestRunEntity } from "./test-run.entity";
import { StepEntity } from "./step.entity";

@Entity({ tableName: "tests" })
export class TestEntity extends BaseEntity implements Test {
    @Property()
    url: string;

    @OneToMany(() => StepEntity, step => step.test)
    steps: StepEntity[];

    @OneToMany(() => TestRunEntity, testRun => testRun.test)
    testRuns?: TestRunEntity[];

    @ManyToOne(() => AssetEntity)
    asset: AssetEntity;
}