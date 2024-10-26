import { sendMessage } from "webext-bridge/content-script";
import { ExtensionComponents } from "@/common/constants";
import { StartTestPayload } from "runnie-common";
import { InternalExtensionActions } from "@/common/internal-actions";
import { Step } from "runnie-common/dist/src/models/step";
import { getElementByXPath } from "@/utils/dom.util";

export const startTest = async (testingPayload: StartTestPayload) => {
    try {
        const result: { success: boolean; tabId: number; } = await sendMessage(
            InternalExtensionActions.PrepareTestingEnvironment,
            testingPayload as any,
            ExtensionComponents.Background
        );

        for (const step of testingPayload.selectedTest.steps) {
            await sendMessage(
                InternalExtensionActions.RunStep,
                step as any,
                { context: ExtensionComponents.ContentScript, tabId: result.tabId }
            );
        }
    } catch (error) {
        console.error(`Something happened while running the test. - ${error}`);
    }
}

export const runStep = async (step: Step) => {
    try {
        console.log(`Running step: ${step.action} on ${step.identifier}`);

        const element = getElementByXPath(step.identifier);

        element?.click();
    } catch (error) {
        console.error(`Something happened while running the test. - ${error}`);
    }
}