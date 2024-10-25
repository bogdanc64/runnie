import { ExtensionExternalMessageType, ExtensionMessage } from "runnie-common";
import { startTest } from "@/units/runner/actions";

export const sendMessageToWebApp = (type: ExtensionExternalMessageType, payload: any = null) => {
    window.postMessage({
        type,
        payload,
        isRunnieEvent: true,
        isWebAppSource: false
    }, '*');
}

export const handleExternalMessage = (message: ExtensionMessage) => {
    const handler = ExternalMessageHandlers[message.type];
    handler ? handler(message) : console.warn(`No handler found for message type: ${message.type}`);
}

export const ExternalMessageHandlers: Partial<Record<ExtensionExternalMessageType, (message: ExtensionMessage) => void>> = {
    [ExtensionExternalMessageType.PING_EXTENSION]: () => {
        sendMessageToWebApp(ExtensionExternalMessageType.PONG_WEBAPP);
    },
    [ExtensionExternalMessageType.START_TEST]: (message: ExtensionMessage) => {
        startTest(message.payload);
    },
}