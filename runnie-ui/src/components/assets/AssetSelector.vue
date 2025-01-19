<script setup lang="ts">
  import type { Asset } from "runnie-common";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "../ui/select";
  import { Icon } from "@iconify/vue";

  interface Props {
    assets: Asset[];
    selectedAsset: Asset;
  }
  const props = defineProps<Props>();
</script>

<template>
  <div class="space-y-2">
    <Select :modelValue="props.selectedAsset?.id?.toString()" @update:modelValue="$emit('select-asset', $event)">
      <SelectTrigger
        class="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80"
      >
        <SelectValue class="me-2" placeholder="Select an asset" />
      </SelectTrigger>
      <SelectContent
        class="text-sm [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
      >
        <template v-for="asset in props.assets">
          <SelectItem :value="asset.id?.toString()">
            <Icon icon="mynaui:globe" width="16" height="16" aria-hidden="true" />
            <span class="truncate me-2">{{ asset.name }}</span>
          </SelectItem>
        </template>
        <div class="px-2.5 py-1.5 text-sm" v-if="props.assets.length === 0">
          <span>No assets found.</span>
        </div>
        <SelectSeparator />
        <div
          value="create"
          class="px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
          @click="$emit('create-asset')"
        >
          <Icon class="text-muted-foreground" icon="mynaui:plus" width="16" height="16" aria-hidden="true" />
          <span class="truncate me-2">Create a new asset</span>
        </div>
      </SelectContent>
    </Select>
  </div>
</template>
