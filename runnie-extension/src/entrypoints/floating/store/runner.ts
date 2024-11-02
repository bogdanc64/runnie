import { StoreIdentifier } from "@/common/constants";
import { useInitializeStore } from "@/composables/useInitializeStore";
import { RunnerStoreFields, DefaultStore } from "@/units/runner/store";
import { Store, withPersistenceAsync } from "@/units/store";
import { defineStore } from "pinia";
import { storage } from "wxt/storage"

export const useRunnerStore = defineStore("runner", {
    state: () => ({ ...DefaultStore }),

    getters: {

    },

    actions: {
        async initialize() {
            const store = await storage.getItem(StoreIdentifier) as Store; 

            this.updateStoreFromStorage(store.runner as RunnerStoreFields)
        },
        updateStoreFromStorage(store: RunnerStoreFields) {
            this.currentTest = store.currentTest;
            this.currentTestRun = store.currentTestRun;
            this.currentStep = store.currentStep;
        }
    }
});

storage.watch(StoreIdentifier, (changes: Store | null) => {
    if (changes?.runner) {
        const store = useRunnerStore();
        store.updateStoreFromStorage(changes.runner as RunnerStoreFields);
    }
})