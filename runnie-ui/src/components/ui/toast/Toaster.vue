<script setup lang="ts">
  import { isVNode } from "vue";
  import { useToast } from "./use-toast";
  import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from ".";
  import { Icon } from "@iconify/vue";

  const { toasts } = useToast();
</script>

<template>
  <ToastProvider>
    <Toast v-for="toast in toasts" :key="toast.id" v-bind="toast">
      <div class="grid gap-1">
        <ToastTitle v-if="toast.title">
          <div class="flex flex-row">
            <Icon v-if="toast.icon" :icon="toast.icon" class="h-[1.2rem] w-[1.2rem] mr-2" />
            <span>{{ toast.title }}</span>
          </div>
        </ToastTitle>
        <template v-if="toast.description">
          <ToastDescription v-if="isVNode(toast.description)">
            <component :is="toast.description" />
          </ToastDescription>
          <ToastDescription v-else>
            {{ toast.description }}
          </ToastDescription>
        </template>
        <ToastClose />
      </div>
      <component :is="toast.action" />
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
