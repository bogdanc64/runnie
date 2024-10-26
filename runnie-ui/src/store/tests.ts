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
                    steps: [{
                        action: "left-click",
                        identifier: "//*[@id=\"auxiliary\"]/div/div/ul[2]/li[3]/a"
                    },{
                        action: "left-click",
                        identifier: "//*[@id=\"cp_widget_63464\"]/div/div[2]/div[1]/a"
                    }]
                } as Test
            } as StartTestPayload;
            sendMessageToExtension({ type: ExtensionExternalMessageType.START_TEST, payload })
        }
    },
});