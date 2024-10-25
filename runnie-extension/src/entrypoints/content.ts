import { ContentScriptContext } from 'wxt/client';
import { onMessage, sendMessage } from "webext-bridge/content-script";
import { ExtensionActionsIdentifiers } from "@/units/extension";
import { handleExternalMessage, sendMessageToWebApp } from "@/services/external-message.service";
import { ExtensionExternalMessageType, ExtensionMessage, ExtensionSettings } from "runnie-common";
import { mountFloatingExtension } from "./floating/main";
import { ExtensionComponents } from '@/common/constants';
import { config } from '@/config';
import { BridgeMessage } from 'webext-bridge';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(context) {
    pingBackgroundToSetupExtension();
    defineInternalMessageHandlers(context);
  },
});

const defineInternalMessageHandlers = (context: ContentScriptContext) => {
  onMessage(ExtensionActionsIdentifiers.ConnectToWebApp, async (message: BridgeMessage<any>) => await connectToWebApp(message.data as ExtensionSettings | null));  
  onMessage(ExtensionActionsIdentifiers.MountFloatingExtension, async () => await mountFloatingExtension(context));
}

const pingBackgroundToSetupExtension = () => {
  sendMessage(
    ExtensionActionsIdentifiers.SetupExtension,
    {},
    ExtensionComponents.Background
  )
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