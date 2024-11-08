import { withPersistenceAsync } from "../store";

export interface ExtensionStoreFields {
    currentTestingTabId: number | null;
    isWaitingForNetworkRequests: boolean;
}

export interface ExtensionStoreSetters {
    resetState(): Promise<void>;
    setCurrentTestingTabId(tabId: number | null): Promise<void>;
    setIsWaitingForNetworkRequests(value: boolean): Promise<void>;
}

export type ExtensionStore = ExtensionStoreFields & ExtensionStoreSetters;

export const DefaultStore: ExtensionStoreFields = {
    currentTestingTabId: null,
    isWaitingForNetworkRequests: false,
};

export const defineExtensionStore = (): ExtensionStore => {
    const storeFields: ExtensionStoreFields = { ...DefaultStore };

    const store: ExtensionStore = {
        ...storeFields,
        resetState() {
            return withPersistenceAsync(() => {
                Object.assign(this, DefaultStore);
            })
        },
        setIsWaitingForNetworkRequests(value: boolean) {
            return withPersistenceAsync(() => {
                this.isWaitingForNetworkRequests = value;
            })
        },
        setCurrentTestingTabId(tabId: number | null) {
            return withPersistenceAsync(() => {
                this.currentTestingTabId = tabId;
            })
        },
    };

    return store;
};
