import { useExtensionStore } from "@/store/extension";
import type { ExtensionMessage, ExtensionSettings } from "runnie-common";
import { ExtensionExternalMessageType } from "runnie-common/dist/src/models/extension";

export const sendMessageToExtension = (message: ExtensionMessage) => {
    window.postMessage({ ...message, isRunnieEvent: true, isWebAppSource: true }, '*');
}

export const handleExtensionMessage = (message: ExtensionMessage) => {
    const handler = ExtensionMessageHandlers[message.type];
    handler ? handler(message) : console.warn(`No handler found for message type: ${message.type}`);
}

export const ExtensionMessageHandlers: Partial<Record<ExtensionExternalMessageType, (message: ExtensionMessage) => void>> = {
    [ExtensionExternalMessageType.CONNECT_TO_WEBAPP]: (message: ExtensionMessage) => {
        const settings = message.payload as ExtensionSettings;
        
        const extensionStore = useExtensionStore();
        
        extensionStore.setExtensionSettings(settings);
        if (!extensionStore.isConnected) {
            extensionStore.setExtensionStatus(true);
        }
    },
    [ExtensionExternalMessageType.PONG_WEBAPP]: () => {
        console.debug('Received pong from extension.');
    },
}