import "./floating/styles.css"
import App from './floating/App.vue';
import { createApp } from 'vue';
import { config } from "@/config";
import { ContentScriptContext } from 'wxt/client';
import { ExtensionMessage, ExtensionMessageType } from "runnie-common/dist/src/models/extension";
import { handleExternalMessage } from "@/services/message.service";
import { onMessage } from "webext-bridge/content-script";
import { ExtensionActionsIdentifiers } from "@/units/extension";

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    defineInternalMessageHandlers(ctx);
    connectToWebApp();
  },
});

const defineInternalMessageHandlers = (ctx: ContentScriptContext) => {
  onMessage(ExtensionActionsIdentifiers.MountFloatingExtension, async () => await mountFloatingExtension(ctx));
}

const connectToWebApp = () => {
  window.postMessage({ type: ExtensionMessageType.CONNECT_TO_WEBAPP, isRunnieEvent: true, isWebAppSource: false }, '*');

  window.addEventListener('message', (event) => {
    // TODO: Add the frontend domain in env vars
    if (!event.origin.includes('localhost') || !event.data.isRunnieEvent || !event.data.isWebAppSource) {
      return;
    }
    
    handleExternalMessage(event.data as ExtensionMessage);
  }); 
}

const mountFloatingExtension = async (ctx: ContentScriptContext) => {
  const ui = await createShadowRootUi(ctx, {
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