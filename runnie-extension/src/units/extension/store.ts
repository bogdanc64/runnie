import { withPersistenceAsync } from "../store";

export interface ExtensionStoreFields {
    currentTestingTabId: number | null;
}

export interface ExtensionStoreSetters {
    resetState(): Promise<void>;
    setCurrentTestingTabId(tabId: number | null): Promise<void>;
}

export type ExtensionStore = ExtensionStoreFields & ExtensionStoreSetters;

const DefaultStore: ExtensionStoreFields = {
    currentTestingTabId: null,
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
        setCurrentTestingTabId(tabId: number | null) {
            return withPersistenceAsync(() => {
                this.currentTestingTabId = tabId;
            })
        },
    };

    return store;
};
