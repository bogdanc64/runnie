import { ExtensionComponents } from "@/common/constants";
import { OpenBrowserPayload } from "@/common/types";
import { sendMessage } from "webext-bridge/background";

export enum ExtensionActionsIdentifiers {
    OpenDebuggerWindow = 'open-debugger-window',
    MountFloatingExtension = 'mount-floating-extension',
}

export const openDebuggerWindow = async (message: OpenBrowserPayload) => {
    const url = message.URL;
  
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
      
      await sendMessage(ExtensionActionsIdentifiers.MountFloatingExtension, {}, { context: ExtensionComponents.ContentScript, tabId: newTabId });
  
      return { success: true, windowId: newWindow.id };
    } catch (error) {
      console.error('Error in open-debugger-window:', error);
      return { success: false, error: error };
    }
}
