<script setup lang="ts">
  import { Bell, Home, Settings } from "lucide-vue-next";

  import { Button } from "@/components/ui/button";
  import { useRouter } from "vue-router";
  const router = useRouter();

  function isSelectedPage(page: string): boolean {
    return page === router.currentRoute.value.name;
  }

  function navigateToPage(page: string) {
    router.push({ name: page });
  }

</script>

<template>
  <div class="hidden border-r bg-muted/40 md:block">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <a href="/" class="flex items-center gap-2 font-semibold">
          <span class="">Runnie 🚀</span>
        </a>
        <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
          <Bell class="h-4 w-4" />
          <span class="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div class="flex-1">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
          <span class="mx-3 py-2">Pages</span>
          <a
            @click="navigateToPage('dashboard')"
            :class="{
              'bg-primary dark:text-foreground text-secondary bg-muted': isSelectedPage('dashboard'),
            }"
            class="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary hover:bg-muted"
          >
            <Home class="h-4 w-4" />
            Dashboard
          </a>
          <a
            @click="navigateToPage('settings')"
            :class="{ 'bg-muted text-primary hover:text-primary': isSelectedPage('settings') }"
            class="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 my-2 transition-all hover:bg-muted"
          >
            <Settings class="h-4 w-4" />
            Settings
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>
