import { defineStore } from "pinia";
import { ApiClient, type Asset } from "runnie-common";
import { useLoadingStore } from "./loading";

interface AssetState {
    assets: Asset[]
}

const DefaultStore: AssetState = {
    assets: [],
}

export const useAssetStore = defineStore("asset", {
    state: () => ({ ...DefaultStore }),

    actions: {
        async fetchAssets() {
            const loadingStore = useLoadingStore();

            try {
                loadingStore.setLoadingState("assets/fetch", true);
                
                const apiClient = (this as any).apiClient as ApiClient;
                const assets = await apiClient.assets.list();
                this.assets = assets.data;

                return true;
            } catch (error) {
                console.error(error);
                return false;
            } finally {
                loadingStore.setLoadingState("assets/fetch", false);
            }
        }
    },
});