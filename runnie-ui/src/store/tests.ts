import { sendMessageToExtension } from "@/services/message.service";
import { defineStore } from "pinia";
import { ExtensionExternalMessageType } from "runnie-common";
import type { Test, StartTestPayload } from "runnie-common";

interface TestsState {
    tests: any[],
}

const DefaultStore: TestsState = {
    tests: [],
}

export const useTestsStore = defineStore("tests", {
    state: () => ({ ...DefaultStore }),

    actions: {
        startTest() {
            const payload = {
                selectedTest: {
                    id: 1,
                    URL: "https://emag.ro",
                    steps: [{
                        id: 1,
                        action: "left-click",
                        identifier: "//*[@id=\"auxiliary\"]/div/div/ul[2]/li[3]/a"
                    },{
                        id: 2,
                        action: "left-click",//*[@id="cp_widget_44917"]/div/div/div/a[10]
                        identifier: "//*[@id=\"cp_widget_63451\"]/div/div/div/a[1]"
                    }]
                } as Test
            } as StartTestPayload;
            sendMessageToExtension({ type: ExtensionExternalMessageType.START_TEST, payload })
        }
    },
});