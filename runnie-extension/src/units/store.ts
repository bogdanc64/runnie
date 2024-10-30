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
export const persistState = () => {
    if (!storeInstance) return;
    
    try {
        chrome.storage.session.set({
            backgroundState: {
                runner: storeInstance.runner,
                extension: storeInstance.extension
            }
        });
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
    persistState();
    return result;
};

const retrieveStateFromStorage = async (): Promise<Store | null> => {
    try {
        const savedState = await chrome.storage.session.get('backgroundState');

        if (!savedState.backgroundState) {
            return null;
        }
        
        const runner = defineRunnerStore();
        const extension = defineExtensionStore();
        
        Object.assign(runner, savedState.backgroundState.runner);
        Object.assign(extension, savedState.backgroundState.extension);
        
        const store = {
            runner,
            extension,
            resetStore: () => {
                runner.resetState();
                extension.resetState();
            }
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
        resetStore: () => {
            storeInstance?.runner.resetState();
            storeInstance?.extension.resetState();
        }
    };

    return storeInstance;
};