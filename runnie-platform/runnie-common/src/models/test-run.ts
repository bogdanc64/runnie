import { Model } from "./model";

export enum TestRunStatus {
    Running = "running",
    Passed = "passed",
    PassedWithWarnings = "passed-with-warnings",
    Failed = "failed",
    Skipped = "skipped"
}

export interface TestRun extends Model {
    testId: string;
    startTime: number;
    endTime: number;
    status: TestRunStatus;
}