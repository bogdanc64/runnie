import { ExtensionComponents } from "@/common/constants";
import { InternalExtensionActions } from "@/common/internal-actions";
import { config } from "@/config";
import { ExtensionSettings, StartTestPayload } from "runnie-common";
import { sendMessage } from "webext-bridge/background";
import { getStore } from "../store";
import { injectRunnerScript } from "../runner";

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

    const newTab = newWindow?.tabs?.[0]; 
    if (!newTab?.id) {
      throw new Error('No tab found in new window');
    }

    const debuggee = { tabId: newTab.id };
    await chrome.debugger.attach(debuggee, '1.3');

    addReinjectFloatingListener(newTab.id);
    addSuspendListener(newTab.id);

    return { success: true, tabId: newTab.id };
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

    await injectRunnerScript(newTabId);
  });
}

const addSuspendListener = (newTabId: number) => {
  chrome.tabs.onRemoved.addListener(async (tabId, _) => {
    if (tabId !== newTabId) {
      return;
    }

    const state = await getStore();
    state.resetStore();

    console.log("State cleared")
  });
}