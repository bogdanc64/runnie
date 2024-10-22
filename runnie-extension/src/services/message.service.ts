import { ExtensionMessage } from "runnie-common";
import { ExtensionMessageType } from "runnie-common/dist/src/models/extension";
import { startTest } from "@/units/runner/actions";

export const handleExternalMessage = (message: ExtensionMessage) => {
    const handler = ExternalMessageHandlers[message.type];
    handler ? handler(message) : console.warn(`No handler found for message type: ${message.type}`);
}

export const ExternalMessageHandlers: Partial<Record<ExtensionMessageType, (message: ExtensionMessage) => void>> = {
    [ExtensionMessageType.PING_EXTENSION]: () => {
        window.postMessage({ type: ExtensionMessageType.PONG_WEBAPP, isRunnieEvent: true, isWebAppSource: false }, '*');
    },
    [ExtensionMessageType.START_TEST]: (message: ExtensionMessage) => {
        startTest(message.payload);
    },
}