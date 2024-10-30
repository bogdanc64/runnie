import { defineStore } from 'pinia'

interface LoadingState {
  states: { [key: string]: boolean }
}

const DefaultStore = {
    states: {}
};

export const useLoadingStore = defineStore('loading', {
    state: (): LoadingState => DefaultStore,
    getters: {
        isLoading: (state): ((key: string) => boolean) => {
            return (key: string) => state.states[key] ?? false;
        }
    },
    actions: {
        setLoadingState(key: string, value: boolean) {
            this.states[key] = value;
        }
    },
})