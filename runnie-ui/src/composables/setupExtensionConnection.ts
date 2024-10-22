import { onMounted, onUnmounted } from "vue";
import { useExtensionStore } from "@/store/extension";
import type { ExtensionMessage } from "runnie-common";
import { handleExtensionMessage } from "@/services/message.service";
import { isDeviceSupported } from "@/lib/utils/browser.util";

const MAX_RETRIES = 5;
const TIME_BETWEEN_RETRIES = 5 * 1000;

export function setupExtensionConnection() {
    const store = useExtensionStore();
    let pingInterval: NodeJS.Timeout | undefined;
    let pingRetries: number = 0;

    onMounted(() => {
        if (isDeviceSupported) {
            connectToExtension();
        }
    });

    onUnmounted(() => {
        disconnectFromExtension();
    });

    const connectToExtension = () => {
        window.addEventListener('message', handleMessage);
        startPingExtension();
    }

    const disconnectFromExtension = () => {
        stopPinging();
        window.removeEventListener('message', handleMessage);
    }

    const handleMessage = (event: MessageEvent) => {
        const message = event.data as ExtensionMessage;
        if (!message.isRunnieEvent || message.isWebAppSource) {
            return;
        };

        pingRetries = 0;
        handleExtensionMessage(message);
    };

    const startPingExtension = () => {
        pingInterval = setInterval(() => {
            if (pingRetries === MAX_RETRIES) {
                stopPinging();
                store.setExtensionStatus(false)
            };

            store.pingExtension();
            pingRetries++;
        }, TIME_BETWEEN_RETRIES);
    }

    const stopPinging = () => {
        clearInterval(pingInterval);
        pingInterval = undefined;
    }
}