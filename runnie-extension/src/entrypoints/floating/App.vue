<template>
  <div :id="config.floatingComponent.containerId" class="extension-popup">
    <div
      class="ps-3 h-[4rem] flex items-center border-b border-dashed cursor-grab"
      :id="config.floatingComponent.draggableZoneId"
    >
      {{ config.displayedAppTitle }}
    </div>
    <div class="ps-3 flex flex-col mt-5">
      <test-run-details></test-run-details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { config } from "@/config";
import TestRunDetails from "./components/TestRunDetails.vue";
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
