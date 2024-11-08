import { onMessage } from 'webext-bridge/background'
import { prepareTestingEnvironment, setupExtension } from '@/units/extension/actions';
import { InternalExtensionActions } from '@/common/internal-actions';
import { defineBackground } from 'wxt/sandbox'

export default defineBackground(() => {
  console.log("Injected background script");
  
  defineSettings();
  defineInternalMessageHandlers();  
})

const defineSettings = () => {
  chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
}

const defineInternalMessageHandlers = () => {
  onMessage(InternalExtensionActions.SetupExtension, async () => await setupExtension());
  onMessage(InternalExtensionActions.PrepareTestingEnvironment, async (message) => await prepareTestingEnvironment(message.data as any));
}