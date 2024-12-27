<script setup lang="ts">
  import { RouterView } from "vue-router";
  import { useSetupExtensionConnection } from "@/composables/useSetupExtensionConnection";
  import { useHydrateState } from "@/composables/useHydrateState";
  import Toaster from "@/components/ui/toast/Toaster.vue";

  useSetupExtensionConnection();
  useHydrateState();
</script>

<template>
  <Toaster />
  <RouterView />
</template>
