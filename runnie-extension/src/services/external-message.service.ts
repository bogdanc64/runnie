import { ExtensionExternalMessageType, ExtensionMessage } from "runnie-common";
import { startTest } from "@/units/runner/actions";
import { sendMessage } from "webext-bridge/content-script";
import { InternalExtensionActions } from "@/common/internal-actions";
import { ExtensionComponents } from "@/common/constants";

export const sendMessageToWebApp = (type: ExtensionExternalMessageType, payload: any = null) => {
    window.postMessage({
        type,
        payload,
        isRunnieEvent: true,
        isWebAppSource: false
    }, '*');
}

export const handleExternalMessage = async (message: ExtensionMessage) => {
    const handler = ExternalMessageHandlers[message.type];
    handler ? await handler(message) : console.warn(`No handler found for message type: ${message.type}`);
}

export const ExternalMessageHandlers: Partial<Record<ExtensionExternalMessageType, (message: ExtensionMessage) => void | Promise<void>>> = {
    [ExtensionExternalMessageType.PING_EXTENSION]: () => {
        sendMessageToWebApp(ExtensionExternalMessageType.PONG_WEBAPP);
    },
    [ExtensionExternalMessageType.START_TEST]: async (message: ExtensionMessage) => {
        const result: { success: boolean; tabId: number; } = await sendMessage(
            InternalExtensionActions.PrepareTestingEnvironment,
            message.payload,
            ExtensionComponents.Background
        );
        
        if (!result || !result.success) {
            console.error("The testing environment could not be created.");
            return;
        }

        await startTest({...message.payload, tabId: result.tabId});
    },
}