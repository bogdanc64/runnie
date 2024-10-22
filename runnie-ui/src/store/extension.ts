import { sendMessageToExtension } from "@/services/message.service";
import { notifyError, notifySuccess } from "@/services/toast.service";
import { defineStore } from "pinia";
import { ExtensionMessageType } from "runnie-common/dist/src/models/extension";

interface ExtensionState {
    isConnected: boolean,
}

const DefaultState: ExtensionState = {
    isConnected: false,
}

export const useExtensionStore = defineStore("extension", {
    state: () => ({ ...DefaultState }),

    actions: {
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
            sendMessageToExtension({ type: ExtensionMessageType.PING_EXTENSION });
        }
    },
});