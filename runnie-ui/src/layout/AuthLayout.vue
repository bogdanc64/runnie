<script setup lang="ts">
  import { DarkModeToggle } from "@/components/ui/darkmode-toggle";
  import { useRouter } from "vue-router";

  const router = useRouter();

  function navigateToSignIn() {
    router.push({ name: "sign-in", replace: true });
  }
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex h-[var(--header-height)] py-6 px-10 justify-between">
      <div class="cursor-pointer" @click="navigateToSignIn()">
        <h1 class="text-lg cursor-pointer">Runnie 🚀</h1>
      </div>
      <DarkModeToggle />
    </div>
    <div class="flex justify-center flex-1 items-center -pt-[var(--header-height)/2]">
      <router-view />
    </div>
  </div>
</template>
