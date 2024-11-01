<template>
  <div :id="config.floatingComponent.containerId" class="extension-popup">
    <div
      class="ps-3 h-[4rem] flex items-center border-b border-dashed cursor-grab"
      :id="config.floatingComponent.draggableZoneId"
    >
      {{ config.displayedAppTitle }}
    </div>
    <button @click="refreshState">Refresh state</button>
    <div class="ps-3 flex flex-col mt-5">
      <template v-if="storeLoaded">
        <template v-if="store?.runner.currentStep">
          <span>
            💬 Running
            <span class="font-semibold break-words"
              >{{ store.runner.currentStep.identifier }}
            </span>
            step
          </span>
        </template>
        <template
          v-else-if="
            store?.runner.currentTestRun?.status === TestRunStatus.Passed
          "
        >
          ✅ The test execution was finished successfully.
        </template>
        <template v-else> ❌ The test execution has failed. </template>
      </template>
      <template v-else>
        <div>Loading...</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { config } from "@/config";
import { getStore, Store } from "@/units/store";
import { TestRunStatus } from "runnie-common";

const store = ref<Store | null>(null);
const storeLoaded = ref(false);

// TODO: Refactor this to use Suspense - async component
onMounted(async () => {
  await refreshState();
});

const refreshState = async () => {
  storeLoaded.value = false;
  store.value = await getStore();
  storeLoaded.value = true;
};
</script>

<style>
.extension-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #e0e7f0;
  border-radius: 5px;
  z-index: 9999;
  min-width: 240px;
  max-width: 240px;
  height: 300px;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
