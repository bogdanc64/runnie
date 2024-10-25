import { OpenBrowserPayload } from '@/common/types';
import { onMessage } from 'webext-bridge/background'
import { openDebuggerWindow, ExtensionActionsIdentifiers, setupExtension } from '@/units/extension';

export default defineBackground(() => {
  defineInternalMessageHandlers();
})

const defineInternalMessageHandlers = () => {
  onMessage(ExtensionActionsIdentifiers.SetupExtension, async () => await setupExtension());
  onMessage(
    ExtensionActionsIdentifiers.OpenDebuggerWindow,
    async (message) => await openDebuggerWindow(message.data as OpenBrowserPayload)
  );
}