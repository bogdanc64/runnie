<script setup lang="ts">
  import { Bell, ChartNoAxesCombined, Settings, Globe } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  import { useRouter } from "vue-router";
  import { computed } from "vue";

  interface Props {
    isAssetSelected: boolean;
  }

  const props = defineProps<Props>();
  const router = useRouter();

  const isSelectedPage = computed(() => {
    return (pageName: string) => router.currentRoute.value.name === pageName;
  });

  function navigateToPage(page: string) {
    const assetId = router.currentRoute.value.params.assetId;

    if (assetId) {
      router.push({
        name: page,
        params: { assetId },
      });
    } else {
      router.push({ name: page });
    }
  }
</script>

<template>
  <div class="hidden border-r bg-muted/40 md:block">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <a @click="navigateToPage('assets')" class="flex items-center gap-2 font-semibold cursor-pointer">
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
          <template v-if="props.isAssetSelected">
            <a
              @click="navigateToPage('asset-dashboard')"
              :class="{
                'bg-primary dark:text-foreground text-secondary bg-muted': isSelectedPage('asset-dashboard'),
              }"
              class="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 my-1 transition-all hover:bg-muted"
            >
              <ChartNoAxesCombined class="h-4 w-4" />
              Dashboard
            </a>
            <a
              @click="navigateToPage('settings')"
              :class="{
                'bg-primary dark:text-foreground text-secondary bg-muted': isSelectedPage('settings'),
              }"
              class="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 my-1 transition-all hover:bg-muted"
            >
              <Settings class="h-4 w-4" />
              Settings
            </a>
          </template>
          <template v-else>
            <a
              @click="navigateToPage('assets')"
              :class="{ 'bg-primary dark:text-foreground text-secondary bg-muted': isSelectedPage('assets') }"
              class="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 my-1 transition-all hover:bg-muted"
            >
              <Globe class="h-4 w-4" />
              Assets
            </a>
          </template>
        </nav>
      </div>
    </div>
  </div>
</template>
