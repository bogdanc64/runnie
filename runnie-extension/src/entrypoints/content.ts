import { ContentScriptContext } from 'wxt/client';
import { onMessage, sendMessage } from "webext-bridge/content-script";
import { handleExternalMessage, sendMessageToWebApp } from "@/services/external-message.service";
import { ExtensionExternalMessageType, ExtensionMessage, ExtensionSettings } from "runnie-common";
import { mountFloatingExtension } from "./floating/main";
import { ExtensionComponents } from '@/common/constants';
import { config } from '@/config';
import { BridgeMessage } from 'webext-bridge';
import { InternalExtensionActions } from '@/common/internal-actions';
import { runStep } from '@/units/runner';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(context) {
    sendMessage(InternalExtensionActions.SetupExtension, null, ExtensionComponents.Background);
    defineInternalMessageHandlers(context);
  },
});

const defineInternalMessageHandlers = (context: ContentScriptContext) => {
  onMessage(InternalExtensionActions.ConnectToWebApp, async (message: BridgeMessage<any>) => await connectToWebApp(message.data));  
  
  // Handlers for testing browser instance
  onMessage(InternalExtensionActions.MountFloatingExtension, async () => await mountFloatingExtension(context));
  onMessage(InternalExtensionActions.RunStep, async (step: BridgeMessage<any>) => await runStep(step.data));
}

const connectToWebApp = async (settings: ExtensionSettings | null) => {
  if (!settings) {
    return;
  }

  sendMessageToWebApp(ExtensionExternalMessageType.CONNECT_TO_WEBAPP, settings);
  defineExternalMessageHandler();
}

const defineExternalMessageHandler = () => {
  window.removeEventListener('message', messageEventsListener);
  window.addEventListener('message', messageEventsListener);
}

function messageEventsListener(event: MessageEvent<ExtensionMessage>) {
  if (!event.origin.includes(config.frontendOrigin) || !event.data.isRunnieEvent || !event.data.isWebAppSource) {
    return;
  }
  
  handleExternalMessage(event.data);
};