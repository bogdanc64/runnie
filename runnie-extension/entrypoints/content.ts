import "./floating/styles.css"
import { createApp } from 'vue';
import { config } from "@/config";
import { ContentScriptContext } from 'wxt/client';
import App from './floating/App.vue';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    if (config.floatingComponent.defaultVisibility === false) return;

    await mountFloatingExtension(ctx);
  },
});

const mountFloatingExtension = async (ctx: ContentScriptContext) => {
  const ui = await createShadowRootUi(ctx, {
    name: 'floating-container',
    position: 'overlay',
    onMount(container) {
      try {
        const app = createApp(App);
        app.mount(container);      
        addDragFunctionality(container);

      } catch (error) {
        console.error('Error mounting the extension:', error);
      }
    },
  });

  ui.mount();
  
};

const addDragFunctionality = (container: HTMLElement) => {
  const popup = container.querySelector(`#${config.floatingComponent.containerId}`) as HTMLElement;
  const dragZone = container.querySelector(`#${config.floatingComponent.draggableZoneId}`) as HTMLElement;

  if (!popup || !dragZone) {
    console.error('Required elements not found');
    return;
  }

  let isDragging = false;
  let startX = 0, startY = 0;

  const startDragging = (e: MouseEvent) => {
    isDragging = true;
    startX = e.clientX - popup.offsetLeft;
    startY = e.clientY - popup.offsetTop;
  };

  const drag = (e: MouseEvent) => {
    if (!isDragging) return;
    popup.style.left = `${e.clientX - startX}px`;
    popup.style.top = `${e.clientY - startY}px`;
  };

  const stopDragging = () => isDragging = false;

  dragZone.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);
};