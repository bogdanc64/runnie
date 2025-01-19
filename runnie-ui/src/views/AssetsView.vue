<script setup lang="ts">
  import { useAssetStore } from "@/store/asset";
  import type { Asset } from "runnie-common";
  import { onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";

  const assetStore = useAssetStore();
  const router = useRouter();

  onMounted(() => {
    assetStore.selectedAsset = null;
  });

  function selectAsset(asset: Asset) {
    assetStore.selectedAsset = asset;
    router.push({ name: "asset-dashboard", params: { assetId: asset.id } });
  }

  function createAsset() {
    assetStore.isCreateAssetPopupOpen = true;
  }
</script>

<template>
  <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
    <div class="flex flex-1 rounded-lg border shadow-sm flex-col">
      <div class="flex px-6 py-4 justify-between">
        <h1 class="text-lg font-semibold md:text-2xl">Assets</h1>
        <Button variant="outline" size="sm" @click="createAsset">Create an asset</Button>
      </div>
      <div class="flex px-6 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <div
            v-for="asset in assetStore.assets"
            :key="asset.id"
            class="flex flex-col p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium">{{ asset.name }}</h3>
            </div>
            <div class="text-sm text-muted-foreground">
              <p>{{ asset.website }}</p>
            </div>
            <div class="mt-4 flex justify-end">
              <Button variant="outline" size="sm" @click="selectAsset(asset)">Select Asset</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
