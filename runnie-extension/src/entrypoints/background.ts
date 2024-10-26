import { onMessage } from 'webext-bridge/background'
import { prepareTestingEnvironment, setupExtension } from '@/units/extension';
import { InternalExtensionActions } from '@/common/internal-actions';

export default defineBackground(() => {
  defineInternalMessageHandlers();
})

const defineInternalMessageHandlers = () => {
  onMessage(InternalExtensionActions.SetupExtension, async () => await setupExtension());
  onMessage(
    InternalExtensionActions.PrepareTestingEnvironment,
    async (message) => await prepareTestingEnvironment(message.data as any)
  );
}