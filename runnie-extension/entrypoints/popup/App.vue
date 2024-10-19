<script lang="ts" setup>
import { config } from "@/config";
</script>

<template>
  <div class="flex flex-col">
    <div class="py-5 px-2 h-[2rem] flex items-center border-b border-dashed">
      {{ config.displayedAppTitle }}
    </div>
    <div>Popup content</div>
  </div>
</template>
