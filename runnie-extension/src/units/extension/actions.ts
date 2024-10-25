import { ExtensionComponents } from "@/common/constants";
import { OpenBrowserPayload } from "@/common/types";
import { config } from "@/config";
import { ExtensionSettings } from "runnie-common";
import { sendMessage } from "webext-bridge/background";

export enum ExtensionActionsIdentifiers {
    SetupExtension = 'setup-extension',
    ConnectToWebApp = 'connect-to-web-app',
    OpenDebuggerWindow = 'open-debugger-window',
    MountFloatingExtension = 'mount-floating-extension',
}

export const setupExtension = async () => {
  const extensionSettings = {} as ExtensionSettings;

  extensionSettings.isAllowedInIncognito = await chrome.extension.isAllowedIncognitoAccess();
  const tabId = await returnWebAppTabId();

  if (tabId === null) {
    console.error("Web app is not opened.");
    return;
  }

  sendMessage(
    ExtensionActionsIdentifiers.ConnectToWebApp,
    { ...extensionSettings },
    { context: ExtensionComponents.ContentScript, tabId }
  )
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
      
      await sendMessage(
        ExtensionActionsIdentifiers.MountFloatingExtension, 
        {}, 
        { context: ExtensionComponents.ContentScript, tabId: newTabId }
      );
  
      return { success: true, windowId: newWindow.id };
    } catch (error) {
      console.error('Error in open-debugger-window:', error);
      return { success: false, error: error };
    }
}

const returnWebAppTabId = async(): Promise<number | null> => {
  const domain = config.frontendOrigin; 
  
  try {
    const tabs = await chrome.tabs.query({});
    const matchingTab = tabs.find(tab => 
      tab.url && tab.url.includes(domain)
    );
    return matchingTab?.id ?? null;
  } catch (error) {
    console.error('Error checking for tab:', error);
    return null;
  }
} 