import "./styles.css"
import App from './App.vue';
import { ContentScriptContext } from 'wxt/client';
import { createApp } from 'vue';
import { config } from "@/config";

export const mountFloatingExtension = async (context: ContentScriptContext) => {
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
        app.mount(container);

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
};