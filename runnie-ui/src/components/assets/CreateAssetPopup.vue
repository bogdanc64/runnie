<script setup lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { Button } from "@/components/ui/button";
  import { reactive } from "vue";
  import { required, url } from "@vuelidate/validators";
  import { useLoadingStore } from "@/store/loading";
  import { useAssetStore } from "@/store/asset";
  import type { Asset } from "runnie-common";
  import useVuelidate from "@vuelidate/core";

  const emit = defineEmits(["close"]);

  const createAssetData = reactive({
    name: "",
    // description: "",
    website: "",
  });

  const rules = {
    name: { required },
    // description: {},
    website: { required, url },
  };

  const loadingStore = useLoadingStore();
  const assetStore = useAssetStore();
  const validator = useVuelidate(rules, createAssetData);

  async function createAsset() {
    const resultValid = await validator.value.$validate();
    if (!resultValid) {
      return;
    }

    await assetStore.createAsset(createAssetData as Partial<Asset>);
    emit("close");
  }
</script>

<template>
  <Dialog defaultOpen @update:open="$emit('close')">
    <DialogContent>
      <div class="flex flex-col items-center gap-2">
        <DialogHeader>
          <DialogTitle class="sm:text-center">Create a new asset</DialogTitle>
        </DialogHeader>
        <form class="space-y-5 w-full">
          <div class="space-y-2">
            <Label for="asset-name">Name</Label>
            <Input
              id="asset-name"
              type="text"
              @input="validator.name.$touch()"
              :class="{ 'border-destructive': validator.name.$errors.length }"
              v-model="createAssetData.name"
            />
          </div>
          <!-- <div class="space-y-2">
            <Label for="asset-description">Description</Label>
            <Textarea
              id="asset-description"
              aria-label="Asset description"
              @input="validator.description.$touch()"
              :class="{ 'border-destructive': validator.description.$errors.length }"
              v-model="createAssetData.description"
            />
          </div> -->
          <div class="space-y-2">
            <Label for="asset-url">Website URL</Label>
            <Input
              id="asset-url"
              type="text"
              @input="validator.website.$touch()"
              :class="{ 'border-destructive': validator.website.$errors.length }"
              v-model="createAssetData.website"
            />
          </div>
          <div class="space-y-2">
            <div class="w-full flex justify-end">
              <Button @click="$emit('close')" type="button" variant="outline" class="me-5">Cancel</Button>
              <Button
                class="mt-0"
                @click="createAsset"
                :is-loading="loadingStore.isLoading('asset/create')"
                :disabled="validator.$invalid || loadingStore.isLoading('asset/create')"
              >
                Create
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>
