import { Model } from "./model";
import { Step } from "./step";
import { TestRun } from "./test-run";

export interface StartTestPayload {
    selectedTest: Test;
}

export interface Test extends Model {
    URL: string;
    steps: Step[];
    testRuns?: TestRun[];
}
