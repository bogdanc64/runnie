<script setup lang="ts">
  import { AlertCircle } from "lucide-vue-next";
  import type { HTMLAttributes } from "vue";
  import { type AlertVariants, alertVariants } from ".";
  import { cn } from "@/lib/utils";

  const props = defineProps<{
    class?: HTMLAttributes["class"];
    variant?: AlertVariants["variant"];
  }>();
</script>

<template>
  <div :class="cn(alertVariants({ variant }), props.class)" role="alert" class="flex flex-row">
    <template v-if="variant === 'destructive'">
      <AlertCircle class="w-5" />
    </template>
    <div class="flex flex-col pt-1">
      <slot />
    </div>
  </div>
</template>
