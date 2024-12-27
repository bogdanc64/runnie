import { onMounted } from 'vue'
import { useAssetStore } from '@/store/asset'

export function useHydrateState() {
  const assetStore = useAssetStore()
  
  onMounted(async () => {
    await Promise.all([
      assetStore.fetchAssets(),
    ])
  })
}