import { runCurrentStep } from '@/units/runner';
import { getStore } from '@/units/store';

export default defineUnlistedScript(async () => {
  console.log("Injected unlisted script");
  
  await checkIfIsTestRunning();
});

const checkIfIsTestRunning = async () => {
  const store = await getStore();
  
  if (store.runner.currentTest === null|| !store.extension.currentTestingTabId) {
    return;
  }

  await runCurrentStep();
}