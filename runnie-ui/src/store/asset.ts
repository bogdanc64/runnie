import { defineStore } from "pinia";
import { ApiClient, type Asset } from "runnie-common";
import { useLoadingStore } from "./loading";
import { useAuthStore } from "./auth";

interface AssetState {
    assets: Asset[],
    isCreateAssetPopupOpen: boolean,
    selectedAsset: Asset | null
}

const DefaultStore: AssetState = {
    assets: [],
    isCreateAssetPopupOpen: false,
    selectedAsset: null
}

export const useAssetStore = defineStore("asset", {
    state: () => ({ ...DefaultStore }),

    actions: {
        async fetchAssets() {
            const loadingStore = useLoadingStore();

            try {
                loadingStore.setLoadingState("asset/fetch", true);
                
                const apiClient = (this as any).apiClient as ApiClient;
                const assets = await apiClient.assets.list();
                this.assets = assets.data ?? [];

                return true;
            } catch (error) {
                console.error(error);
                return false;
            } finally {
                loadingStore.setLoadingState("asset/fetch", false);
            }
        },

        async createAsset(asset: Partial<Asset>) {
            const loadingStore = useLoadingStore();
            const authStore = useAuthStore();

            try {
                loadingStore.setLoadingState("asset/create", true);
                
                asset.organization = authStore.authResponse?.organization;
                const apiClient = (this as any).apiClient as ApiClient;
                const response = await apiClient.assets.create(asset as Asset); // TODO: Find a way to replace the paylod with a custom type one

                if (response.data) {
                    this.assets.push(response.data);
                }

                return true;
            } catch (error) {
                console.error(error);
                return false;
            } finally {
                loadingStore.setLoadingState("asset/create", false);
            }
        }
    },
});