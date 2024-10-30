import { ExtensionComponents } from "@/common/constants";
import { InternalExtensionActions } from "@/common/internal-actions";
import { config } from "@/config";
import { ExtensionSettings, StartTestPayload } from "runnie-common";
import { sendMessage } from "webext-bridge/background";
import { getStore } from "../store";

export const setupExtension = async () => {
  const extensionSettings = {} as ExtensionSettings;

  extensionSettings.isAllowedInIncognito = await chrome.extension.isAllowedIncognitoAccess();
  const tabId = await retrieveWebAppTabId();

  if (tabId === null) {
    console.error("Web app is not opened.");
    return;
  }

  await sendMessage(
    InternalExtensionActions.ConnectToWebApp,
    { ...extensionSettings },
    { context: ExtensionComponents.ContentScript, tabId }
  )
}

export const prepareTestingEnvironment = async (message: StartTestPayload) => {
    const url = message.selectedTest.URL;
  
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

      addReinjectFloatingListener(newTabId);
      addSuspendListener(newTabId);

      return { success: true, tabId: newTabId };
    } catch (error) {
      console.error('Error in prepare-testing-environment:', error);
      return { success: false, error: error };
    }
}

const retrieveWebAppTabId = async(): Promise<number | null> => {
  const domain = config.frontendOrigin; 
  
  try {
    const tabs = await chrome.tabs.query({});
    const matchingTab = tabs.find(tab => tab.url?.includes(domain));
    return matchingTab?.id ?? null;
  } catch (error) {
    console.error('Error checking for tab:', error);
    return null;
  }
} 

const addReinjectFloatingListener = (newTabId: number) => {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (tabId !== newTabId || changeInfo.status !== 'complete') {
      return;
    }

    await sendMessage(
      InternalExtensionActions.MountFloatingExtension, 
      null, 
      { context: ExtensionComponents.ContentScript, tabId: newTabId }
    );
  });
}

function addSuspendListener(newTabId: number) {
  chrome.tabs.onRemoved.addListener(async (tabId, _) => {
    if (tabId !== newTabId) {
      return;
    }

    const state = await getStore();
    state.resetStore();

    console.log("State cleared")
  });
}