<script setup lang="ts">
  import { RouterView } from "vue-router";
  import { useSetupExtensionConnection } from "@/composables/useSetupExtensionConnection";
  import Toaster from "@/components/ui/toast/Toaster.vue";

  useSetupExtensionConnection();
</script>

<template>
  <Toaster />
  <RouterView />
</template>
