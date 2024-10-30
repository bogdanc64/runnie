import { ContentScriptContext } from 'wxt/client';
import { onMessage, sendMessage } from "webext-bridge/content-script";
import { handleExternalMessage, sendMessageToWebApp } from "@/services/external-message.service";
import { ExtensionExternalMessageType, ExtensionMessage, ExtensionSettings } from "runnie-common";
import { mountFloatingExtension } from "./floating/main";
import { ExtensionComponents } from '@/common/constants';
import { config } from '@/config';
import { BridgeMessage } from 'webext-bridge';
import { InternalExtensionActions } from '@/common/internal-actions';
import { finishTest, runCurrentStep, stepComplete } from '@/units/runner';
import { getStore } from '@/units/store';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(context) {
    defineInternalMessageHandlers(context);
    await sendMessage(InternalExtensionActions.SetupExtension, null, ExtensionComponents.Background);
    await checkIfIsTestRunning();
  },
});

const checkIfIsTestRunning = async () => {
  const store = await getStore();
  // TODO: Add an util for comparing the objects
  if (
    store.runner.currentTest === null
    || (
      store.runner.currentStep?.identifier == store.runner.currentTest.steps[0]?.identifier
      && store.runner.currentStep?.action == store.runner.currentTest.steps[0]?.action
    )
    || !store.extension.currentTestingTabId
  ) {
    console.log("returned")
    return;
  }

  sendMessage(
    InternalExtensionActions.RunCurrentStep,
    null,
    { context: ExtensionComponents.ContentScript, tabId: store.extension.currentTestingTabId }
  );
}

const defineInternalMessageHandlers = (context: ContentScriptContext) => {
  onMessage(InternalExtensionActions.ConnectToWebApp, async (message: BridgeMessage<any>) => await connectToWebApp(message.data));  
  
  // Handlers for testing browser instance
  onMessage(InternalExtensionActions.MountFloatingExtension, async () => await mountFloatingExtension(context));
  onMessage(InternalExtensionActions.RunCurrentStep, async () => await runCurrentStep());
  onMessage(InternalExtensionActions.StepComplete, async () => await stepComplete());
  onMessage(InternalExtensionActions.ClearState, async () => (await getStore()).resetStore());
  onMessage(InternalExtensionActions.FinishTest, async (message: BridgeMessage<any>) => await finishTest(message.data));
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