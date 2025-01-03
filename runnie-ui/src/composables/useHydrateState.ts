import { ref } from 'vue'
import { useAssetStore } from '@/store/asset'

export function useHydrateState() {
  const assetStore = useAssetStore()
  const hasHydrated = ref(false)
  
  const hydrateState = async () => {
    if (hasHydrated.value) return
    await assetStore.fetchAssets()
    hasHydrated.value = true
  }

  return {
    hydrateState
  }
}