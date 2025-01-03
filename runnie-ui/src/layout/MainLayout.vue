<script setup lang="ts">
  import Header from "@/components/shared/Header.vue";
  import SideMenu from "@/components/shared/SideMenu.vue";
  import CreateAssetPopup from "@/components/assets/CreateAssetPopup.vue";
  import { useAssetStore } from "@/store/asset";
  import { useHydrateState } from "@/composables/useHydrateState";
  import { onMounted } from "vue";

  const assetStore = useAssetStore();
  const { hydrateState } = useHydrateState();

  onMounted(async () => {
    await hydrateState();
  });

  function closeCreateAssetPopup() {
    assetStore.isCreateAssetPopupOpen = false;
  }
</script>

<template>
  <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <SideMenu />
    <div class="flex flex-col">
      <Header />
      <template v-if="assetStore.isCreateAssetPopupOpen">
        <CreateAssetPopup @close="closeCreateAssetPopup" />
      </template>
      <router-view />
    </div>
  </div>
</template>
