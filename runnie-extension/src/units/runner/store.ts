import { Test, TestRun } from "runnie-common";
import { Step } from "runnie-common/dist/src/models/step";
import { withPersistenceAsync } from "../store";

export interface RunnerStoreFields {
    currentTest: Test | null;
    currentStep: Step | null;
    currentTestRun: TestRun | null;
}

export interface RunnerStoreSetters {
    resetState(): Promise<void>;
    setCurrentTestRun(run: TestRun | null): Promise<void>;
    setCurrentTest(test: Test | null): Promise<void>;
    setCurrentStep(step: Step | null): Promise<void>;
}

export type RunnerStore = RunnerStoreFields & RunnerStoreSetters;

const DefaultState: RunnerStoreFields = {
    currentTest: null,
    currentStep: null,
    currentTestRun: null
};

export const defineRunnerStore = (): RunnerStore => {
    const storeFields: RunnerStoreFields = { ...DefaultState };

    const store: RunnerStore = {
        ...storeFields,
        resetState() {
            return withPersistenceAsync(() => {
                Object.assign(this, DefaultState);
            })
        },
        setCurrentTestRun(testRun: TestRun | null) {
            return withPersistenceAsync(() => {
                this.currentTestRun= testRun;
            })
        },
        setCurrentTest(test: Test | null) {
            return withPersistenceAsync(() => {
                this.currentTest = test;
            })
        },
        setCurrentStep(step: Step | null) {
            return withPersistenceAsync(() => {
                this.currentStep = step;
            })
        }
    };

    return store;
};
