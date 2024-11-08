import { StoreIdentifier } from "@/common/constants";
import { ExtensionStoreFields, DefaultStore } from "@/units/extension/store";
import { Store } from "@/units/store";
import { defineStore } from "pinia";
import { storage } from "wxt/storage"

export const useExtensionStore = defineStore("extension", {
    state: () => ({ ...DefaultStore }),

    actions: {
        async initialize() {
            const store = await storage.getItem(StoreIdentifier) as Store; 

            this.updateStoreFromStorage(store.extension as ExtensionStoreFields)
        },
        updateStoreFromStorage(store: ExtensionStoreFields) {
            this.isWaitingForNetworkRequests = store.isWaitingForNetworkRequests;
            this.currentTestingTabId = store.currentTestingTabId;
        }
    }
});