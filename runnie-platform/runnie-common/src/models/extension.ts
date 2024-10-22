export enum ExtensionMessageType {
    CONNECT_TO_WEBAPP = 'CONNECT_TO_WEBAPP',
    PING_EXTENSION = 'PING_EXTENSION',
    PONG_WEBAPP = 'PONG_WEBAPP',
    START_TEST = 'START_TEST'
}

export interface ExtensionMessage {
    type: ExtensionMessageType;
    payload?: any;
    isRunnieEvent?: boolean;
    isWebAppSource?: boolean;
}