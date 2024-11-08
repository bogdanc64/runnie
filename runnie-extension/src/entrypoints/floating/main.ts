import "./styles.css"
import App from './App.vue';
import { ContentScriptContext } from 'wxt/client';
import { createApp } from 'vue';
import { config } from "@/config";
import { createPinia } from "pinia";
import { StoreIdentifier } from "@/common/constants";
import { ExtensionStoreFields } from "@/units/extension/store";
import { useExtensionStore } from "./store/extension";
import { Store } from "@/units/store";
import { RunnerStoreFields } from "@/units/runner/store";
import { useRunnerStore } from "./store/runner";

export const mountFloatingExtension = async (context: ContentScriptContext) => {
  try {
    const existingContainer = document.getElementById(config.floatingComponent.containerId);
    if (existingContainer) {
      return;
    };

    const ui = await createShadowRootUi(context, {
      name: 'floating-container',
      position: 'overlay',
      onMount(container) {
        try {
          const app = createApp(App);
          const pinia = createPinia();

          app.use(pinia)
          app.mount(container);

          addUpdateStateListener();

          addDragFunctionality({ 
            container: container,
            floatingContainerId: config.floatingComponent.containerId,
            draggableZoneId: config.floatingComponent.draggableZoneId,
          });
        } catch (error) {
          console.error('Error mounting the extension:', error);
        }
      },
    });

    ui.mount();

    return true;
  } catch (error) {
    console.error('Error mounting the extension:', error);
  }
};

const addUpdateStateListener = () => {
  storage.watch(StoreIdentifier, (changes: Store | null) => {
    if (changes?.extension) {
        const store = useExtensionStore();
        console.log("Extension store changed", changes.extension);
        store.updateStoreFromStorage(changes.extension as ExtensionStoreFields);
    } 
    
    if (changes?.runner) {
      const store = useRunnerStore();
      console.log("Runner store changed", changes.runner);
      store.updateStoreFromStorage(changes.runner as RunnerStoreFields);
    }
})
}
