<template>
  <template v-if="extensionStore.isWaitingForNetworkRequests">
    🛜 Waiting the network requests to finish.
  </template>
  <template v-else-if="runnerStore.currentStep">
    <span>
      💬 Running
      <span class="font-semibold break-words"
        >{{ runnerStore.currentStep.identifier }}
      </span>
      step
    </span>
  </template>
  <template
    v-else-if="runnerStore.currentTestRun?.status === TestRunStatus.Passed"
  >
    ✅ The test execution was finished successfully.
  </template>
  <template v-else>❌ The test execution has failed.</template>
</template>

<script setup lang="ts">
import { TestRunStatus } from "runnie-common";
import { useRunnerStore } from "../store/runner";
import { useExtensionStore } from "../store/extension";

const extensionStore = useExtensionStore();
const runnerStore = useRunnerStore();

onMounted(() => {
  extensionStore.initialize();
  runnerStore.initialize();
});
</script>
