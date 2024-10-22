<script setup lang="ts">
  import { RouterView } from "vue-router";
  import { setupExtensionConnection } from "@/composables/setupExtensionConnection";
  import Toaster from "@/components/ui/toast/Toaster.vue";

  setupExtensionConnection();
</script>

<template>
  <Toaster />
  <RouterView />
</template>
