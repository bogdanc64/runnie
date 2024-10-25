import { sendMessageToExtension } from "@/services/message.service";
import { defineStore } from "pinia";
import { ExtensionExternalMessageType } from "runnie-common";
import type { Test, StartTestPayload } from "runnie-common";

interface TestsState {
    tests: any[],
}

const DefaultState: TestsState = {
    tests: [],
}

export const useTestsStore = defineStore("tests", {
    state: () => ({ ...DefaultState }),

    actions: {
        startTest() {
            const payload = {
                selectedTest: {
                    id: 1,
                    URL: "https://emag.ro",

                } as Test
            } as StartTestPayload;
            sendMessageToExtension({ type: ExtensionExternalMessageType.START_TEST, payload })
        }
    },
});