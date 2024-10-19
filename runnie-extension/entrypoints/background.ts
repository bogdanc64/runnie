import { Actions } from '@/common/constants';
import { OpenBrowserPayload } from '@/common/types';
import { BridgeMessage } from 'webext-bridge';
import { onMessage } from 'webext-bridge/background'

export default defineBackground(() => {
  onMessage(Actions.OpenDebuggerWindow, openDebuggerWindow);
})

const openDebuggerWindow = async (message: BridgeMessage<OpenBrowserPayload>) => {
  const url = message?.data?.URL;

  if (!url) {
    return { success: false, error: 'No URL provided' };
  }

  try {
    const newWindow = await chrome.windows.create({
      url,
      type: 'normal',
      incognito: true,
    });

    const newTabId = newWindow?.tabs?.[0]?.id; 
    if (!newTabId) {
      throw new Error('No tab found in new window');
    }

    const debuggee = { tabId: newTabId };
    await chrome.debugger.attach(debuggee, '1.3');

    return { success: true, windowId: newWindow.id };
  } catch (error) {
    console.error('Error in open-debugger-window:', error);
    return { success: false, error: error };
  }
}