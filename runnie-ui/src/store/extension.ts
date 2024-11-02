import { sendMessageToExtension } from "@/services/message.service";
import { notifyError, notifySuccess } from "@/services/toast.service";
import { defineStore } from "pinia";
import { ExtensionExternalMessageType, type ExtensionSettings } from "runnie-common";

interface ExtensionState {
    isConnected: boolean,
    settings: ExtensionSettings | null
}

const DefaultStore: ExtensionState = {
    isConnected: false,
    settings: null,
}

export const useExtensionStore = defineStore("extension", {
    state: () => ({ ...DefaultStore }),

    getters: {
        isPreparedForTesting: (state) => state.isConnected && state.settings?.isAllowedInIncognito,
    },

    actions: {
        disconnectFromExtension() {
            this.setExtensionSettings(null);
            this.setExtensionStatus(false)
        },
        setExtensionSettings(settings: ExtensionSettings | null) {
            this.settings = settings;

            if (settings) {
                checkExtensionSettings(settings);
            }
        },
        setExtensionStatus(connected: boolean) {
            this.isConnected = connected;

            if (connected) {
                notifySuccess(
                    "Connected to Runnie. You can now use Runnie in your browser"
                )
            } else {
                notifyError(
                    "Unfortunately, we couldn't establish the connection with the extension. The local run functionality will be disabled.",
                );
            }
        },
        pingExtension() {
            sendMessageToExtension({ type: ExtensionExternalMessageType.PING_EXTENSION });
        }
    },
});

const checkExtensionSettings = (settings: ExtensionSettings) => {
    if (!settings.isAllowedInIncognito) {
        notifyError(
            "The extension is not allowed in incognito mode. Please allow the extension to run in incognito.",
        );
    }
};