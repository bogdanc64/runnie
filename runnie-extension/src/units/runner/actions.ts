import { sendMessage } from "webext-bridge/content-script";
import { OpenBrowserPayload } from "@/common/types";
import { ExtensionComponents } from "@/common/constants";
import { StartTestPayload } from "runnie-common";
import { ExtensionActionsIdentifiers } from '@/units/extension';

export const startTest = (payload: StartTestPayload) => {
    sendMessage(
        ExtensionActionsIdentifiers.OpenDebuggerWindow,
        payload.selectedTest as OpenBrowserPayload,
        ExtensionComponents.Background
    );
}