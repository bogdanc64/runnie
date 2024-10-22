import { OpenBrowserPayload } from '@/common/types';
import { onMessage } from 'webext-bridge/background'
import { openDebuggerWindow, ExtensionActionsIdentifiers } from '@/units/extension';

export default defineBackground(() => {
  onMessage(
    ExtensionActionsIdentifiers.OpenDebuggerWindow,
    async (message) => await openDebuggerWindow(message.data as OpenBrowserPayload)
  );
})