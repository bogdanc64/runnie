<script setup lang="ts">
  import Header from "@/components/shared/Header.vue";
  import SideMenu from "@/components/shared/SideMenu.vue";
</script>

<template>
  <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <SideMenu />
    <div class="flex flex-col">
      <Header />
      <router-view />
    </div>
  </div>
</template>
