<script setup lang="ts">
  import type { Asset } from "runnie-common";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
  import { Icon } from "@iconify/vue";

  export interface Props {
    assets: Asset[];
  }

  const props = defineProps<Props>();
</script>

<template>
  <div class="space-y-2">
    <Select v-if="props.assets.length > 0" :default-value="props.assets[0]?.id?.toString()">
      <SelectTrigger
        class="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80"
      >
        <SelectValue placeholder="Select an asset" />
      </SelectTrigger>
      <SelectContent
        class="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
      >
        <template v-for="asset in props.assets">
          <SelectItem :value="asset.id?.toString()">
            <Icon icon="mynaui:globe" width="16" height="16" aria-hidden="true" />
            <span class="truncate me-2">{{ asset.name }}</span>
          </SelectItem>
        </template>
      </SelectContent>
    </Select>
    <!-- TODO: Add a button to create an asset -->
    <template v-else>
      <span class="text-sm">No assets found.</span>
    </template>
  </div>
</template>
