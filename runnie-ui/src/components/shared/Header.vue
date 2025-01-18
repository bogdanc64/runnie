<script setup lang="ts">
  import { CircleUser, Home, Menu, Package2 } from "lucide-vue-next";

  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
  import DarkModeToggle from "@/components/ui/darkmode-toggle/DarkModeToggle.vue";
  import { useAuthStore } from "@/store/auth";
  import { useRouter } from "vue-router";
  import AssetSelector from "../assets/AssetSelector.vue";
  import { useAssetStore } from "@/store/asset";

  const authStore = useAuthStore();
  const assetStore = useAssetStore();
  const router = useRouter();

  async function logout() {
    const result = await authStore.signOut();
    if (!result) {
      return;
    }

    router.push({ name: "sign-in", replace: true });
  }

  function selectAsset(assetId: string) {
    assetStore.selectedAsset = assetStore.assets.find(asset => asset.id?.toString() === assetId) ?? null;
  }

  function createAsset() {
    assetStore.isCreateAssetPopupOpen = true;
  }

  function navigateToHome() {
    router.push({ path: "/", replace: true });
  }
</script>

<template>
  <header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
    <Sheet>
      <SheetTrigger as-child>
        <Button variant="outline" size="icon" class="shrink-0 md:hidden">
          <Menu class="h-5 w-5" />
          <span class="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" class="flex flex-col">
        <nav class="grid gap-2 text-lg font-medium">
          <a @click="navigateToHome()" class="flex items-center gap-2 text-lg font-semibold cursor-pointer">
            <Package2 class="h-6 w-6" />
            <span class="sr-only">Runnie</span>
          </a>
          <a
            href="#"
            class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <Home class="h-5 w-5" />
            Dashboard
          </a>
        </nav>
      </SheetContent>
    </Sheet>
    <template v-if="assetStore.selectedAsset">
      <AssetSelector
        :assets="assetStore.assets"
        :selected-asset="assetStore.selectedAsset"
        @select-asset="selectAsset"
        @create-asset="createAsset"
      />
    </template>
    <div class="w-full flex-1"></div>
    <DarkModeToggle />
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="secondary" size="icon-sm" class="rounded-full">
          <template v-if="authStore.getUserAvatar">
            <img class="rounded-full" alt="Avatar" :src="authStore.getUserAvatar" />
          </template>
          <template v-else>
            <CircleUser class="h-5 w-5" />
          </template>
          <span class="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{{ authStore.getFullName }} ({{ authStore.getOrganizationName }})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="cursor-pointer">Settings</DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer">Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="cursor-pointer" @click="logout">Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </header>
</template>
