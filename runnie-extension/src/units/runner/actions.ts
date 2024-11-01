import { StartTestPayload, TestRun, TestRunStatus } from "runnie-common";
import { getElementByXPath } from "@/utils/dom.util";
import { getStore } from "../store";

export const startTest = async (testingPayload: StartTestPayload & { tabId: number}) => {
    try {
        const store = await getStore();

        await store.runner.setCurrentTest(testingPayload.selectedTest);
        await store.runner.setCurrentStep(testingPayload.selectedTest.steps[0]);
        await store.extension.setCurrentTestingTabId(testingPayload.tabId);
    } catch (error) {
        console.error(`Something happened while running the test. - ${error}`);
    }
}

export const injectRunnerScript = async(tabId: number, origin: boolean = false) => {
    await browser.scripting.executeScript({
        target: { tabId: tabId },
        files: ['runner.js'],
    });
}

export const runCurrentStep = async () => {
    try {
        await delay(3000); // TODO: Find a way to fix it.
        const store = await getStore();
    
        if (store.extension.currentTestingTabId === null) {
            throw new Error("No tab is linked with the current test.");
        }

        if (!store.runner.currentTest || !store.runner.currentStep) {
            await finishTest({ status: TestRunStatus.Passed });
            return;
        }

        const currentStep = store.runner.currentStep;
        console.log(`Running step: ${currentStep.action} on ${currentStep.identifier}`);

        const element = getElementByXPath(currentStep.identifier);
        
        if (!element) {
            throw new Error(`Element not found: ${currentStep.identifier}`);
        }
        
        element.click();

        await stepComplete();    
    } catch (error) {
        console.error(`Error running step. - ${error}`);

        const store = await getStore();
        if (store.extension.currentTestingTabId === null) {
            return;
        }

        await finishTest({ status: TestRunStatus.Failed });
    }
}

export const stepComplete = async () => {
    try {
        const store = await getStore();

        if (!store.runner.currentTest || !store.runner.currentStep) {
            throw new Error("There isn't a test or a step set in the state.");
        }

        const currentTest = store.runner.currentTest;
        const currentStepIndex = currentTest.steps.findIndex(step => step.id === store.runner.currentStep?.id);

        if (currentStepIndex === -1) {
            throw new Error("Current step not found in the test.");
        }

        if (store.extension.currentTestingTabId === null) {
            throw new Error("No tab is linked with the current test.");
        }

        const nextStep = currentStepIndex + 1 < currentTest.steps.length
            ? currentTest.steps[currentStepIndex + 1]
            : null;

        await store.runner.setCurrentStep(nextStep);
        await runCurrentStep();
    } catch (error) {
        console.error(`Error when setting the current step. - ${error}`);
        
        const store = await getStore();
        if (store.extension.currentTestingTabId === null) {
            return;
        }
        
        await finishTest({ status: TestRunStatus.Failed });
    }
}

export const finishTest = async (payload: { status: TestRunStatus }) => {
    try {
        const store = await getStore();
        const testRun: TestRun = {
            id: -1,
            testId: String(store.runner.currentTest?.id ?? ""),
            status: payload.status,
            startTime: Date.now(),
            endTime: Date.now(),
        }

        await store.runner.setCurrentTest(null);
        await store.runner.setCurrentStep(null);
        await store.runner.setCurrentTestRun(testRun);
    } catch (error) {
        console.error(`Error when finishing the test. - ${error}`);
    }
}