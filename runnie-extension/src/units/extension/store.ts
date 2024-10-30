import { withPersistenceAsync } from "../store";

export interface ExtensionStoreFields {
    currentTestingTabId: number | null;
}

export interface ExtensionStoreSetters {
    resetState(): Promise<void>;
    setCurrentTestingTabId(tabId: number | null): Promise<void>;
}

export type ExtensionStore = ExtensionStoreFields & ExtensionStoreSetters;

const DefaultState: ExtensionStoreFields = {
    currentTestingTabId: null,
};

export const defineExtensionStore = (): ExtensionStore => {
    const storeFields: ExtensionStoreFields = { ...DefaultState };

    const store: ExtensionStore = {
        ...storeFields,
        resetState() {
            return withPersistenceAsync(() => {
                Object.assign(this, DefaultState);
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
