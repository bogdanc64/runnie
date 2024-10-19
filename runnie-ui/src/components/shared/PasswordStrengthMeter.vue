<script setup lang="ts">
  import { computed } from "vue";

  export interface Props {
    passwordScore: number;
  }

  const props = defineProps<Props>();
  const barColor = computed(() => (index: number) => {
    if (index - 1 >= props.passwordScore) {
      return "bg-gray-200 dark:bg-gray-800";
    }
    if (props.passwordScore <= 2) {
      return "bg-red-400";
    }
    if (props.passwordScore <= 4) {
      return "bg-yellow-400";
    }

    return "bg-green-500";
  });
</script>

<template>
  <div class="flex gap-3 pt-1 px-[0.1rem]">
    <template v-for="index in 5">
      <div class="w-1/5">
        <div class="h-1 rounded-xl transition-colors" :class="barColor(index)"></div>
      </div>
    </template>
  </div>
</template>
