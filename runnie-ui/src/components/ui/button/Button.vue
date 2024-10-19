<script setup lang="ts">
  import type { HTMLAttributes } from "vue";
  import { Primitive, type PrimitiveProps } from "radix-vue";
  import { type ButtonVariants, buttonVariants } from ".";
  import { Loader2 } from "lucide-vue-next";
  import { cn } from "@/lib/utils";

  interface Props extends PrimitiveProps {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    isLoading?: ButtonVariants["isLoading"];
    class?: HTMLAttributes["class"];
  }

  const props = withDefaults(defineProps<Props>(), {
    as: "button",
  });
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), props.class)">
    <template v-if="props.isLoading">
      <Loader2 class="w-4 h-4 mr-2 animate-spin" />
      Please wait...
    </template>
    <template v-else>
      <slot />
    </template>
  </Primitive>
</template>
