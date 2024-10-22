<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { useExtensionStore } from "@/store/extension";
  import { useTestsStore } from "@/store/tests";

  const testsStore = useTestsStore();
  const extensionStore = useExtensionStore();

  function startTest() {
    testsStore.startTest();
  }
</script>

<template>
  <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
    <div class="flex flex-1 rounded-lg border shadow-sm flex-col">
      <div class="flex px-6 py-4">
        <h1 class="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div class="flex px-6 py-4">
        <Button :disabled="!extensionStore.isConnected" variant="outline" @click="startTest">Start test</Button>
      </div>
    </div>
  </main>
</template>
