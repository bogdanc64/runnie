import { useExtensionStore } from "@/store/extension";
import type { ExtensionMessage } from "runnie-common";
import { ExtensionMessageType } from "runnie-common/dist/src/models/extension";

export const sendMessageToExtension = (message: ExtensionMessage) => {
    window.postMessage({ ...message, isRunnieEvent: true, isWebAppSource: true }, '*');
}

export const handleExtensionMessage = (message: ExtensionMessage) => {
    const handler = ExtensionMessageHandlers[message.type];
    handler ? handler() : console.warn(`No handler found for message type: ${message.type}`);
}

export const ExtensionMessageHandlers: Partial<Record<ExtensionMessageType, () => void>> = {
    [ExtensionMessageType.CONNECT_TO_WEBAPP]: () => {
        const extensionStore = useExtensionStore();
        extensionStore.setExtensionStatus(true);
    },
    [ExtensionMessageType.PONG_WEBAPP]: () => {
        console.debug('Received pong from extension.');
    },
}