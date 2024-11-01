export enum InternalExtensionActions {
    SetupExtension = 'setup-extension',
    ConnectToWebApp = 'connect-to-web-app',
    PrepareTestingEnvironment = 'prepare-testing-environment',
    InjectRunnerScript = "inject-runner-script",
    MountFloatingExtension = 'mount-floating-extension',
    RunCurrentStep = 'run-current-step',
    StepComplete = 'step-complete',
    FinishTest = 'finish-test',
    ClearState = 'clear-state'
}