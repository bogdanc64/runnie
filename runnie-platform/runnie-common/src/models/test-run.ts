import { Model } from "./model";
import { Test } from "./test";

export enum TestRunStatus {
    Running = "running",
    Passed = "passed",
    PassedWithWarnings = "passed-with-warnings",
    Failed = "failed",
    Skipped = "skipped"
}

export interface TestRun extends Model {
    test: Test;
    startTime: Date;
    endTime: Date;
    status: TestRunStatus;
}