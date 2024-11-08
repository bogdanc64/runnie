import { StoreIdentifier } from "@/common/constants";
import { defineExtensionStore, ExtensionStore } from "./extension/store";
import { defineRunnerStore, RunnerStore } from "./runner/store"

export interface Store {
    runner: RunnerStore;
    extension: ExtensionStore;
    resetStore(): void;
}

let storeInstance: Store | null = null;

export const getStore = async (): Promise<Store> => {
    if (!storeInstance) {
        storeInstance = await defineStore();
    }
    return storeInstance;
};

export const persistState = async () => {
    if (!storeInstance) return;

    try {
        await storage.setItem(StoreIdentifier, storeInstance);
    } catch (error) {
        console.error('Failed to persist state:', error);
    }
};

export const withPersistence = <T>(action: () => T): T => {
    const result = action();
    persistState();
    return result;
};

export const withPersistenceAsync = async <T>(action: () => Promise<T> | T): Promise<T> => {
    const result = action();
    await persistState();
    return result;
};

const retrieveStateFromStorage = async (): Promise<Store | null> => {
    try {
        const savedStore = await storage.getItem(StoreIdentifier) as Store;

        if (!savedStore) {
            return null;
        }
        
        const runner = defineRunnerStore();
        const extension = defineExtensionStore();
        
        Object.assign(runner, savedStore.runner);
        Object.assign(extension, savedStore.extension);
        
        const store = {
            runner,
            extension,
            resetStore: () => storage.removeItem(StoreIdentifier) // TODO: Take into consideration partial store deleting
        };
        
        return store;
    } catch (error) {
        console.error('Failed to recover state:', error);
        return null;
    }
}

const defineStore = async (): Promise<Store> => {
    if (storeInstance) {
        return storeInstance;
    }

    const retreivedStore = await retrieveStateFromStorage();

    if (retreivedStore) {
        storeInstance = retreivedStore;
        return retreivedStore;
    }

    storeInstance = {
        runner: defineRunnerStore(),
        extension: defineExtensionStore(),
        resetStore: () => storage.removeItem(StoreIdentifier)
    };

    return storeInstance;
};