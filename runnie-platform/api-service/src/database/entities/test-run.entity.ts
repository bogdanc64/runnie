import { TestRun, TestRunStatus } from "runnie-common"
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from "./base.entity";
import { TestEntity } from './test.entity';

@Entity({ tableName: "test-runs" })
export class TestRunEntity extends BaseEntity implements TestRun {
    @ManyToOne(() => TestEntity)
    test: TestEntity;

    @Property()
    startTime: Date;

    @Property()
    endTime: Date;

    @Property()
    status: TestRunStatus;
}