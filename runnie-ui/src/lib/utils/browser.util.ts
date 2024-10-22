import Bowser from 'bowser';

const browser = Bowser.getParser(window.navigator.userAgent);

const currentBrowser = browser.getBrowserName();
const currentPlatform = browser.getPlatformType();

export const isDeviceSupported = currentBrowser === 'Chrome' && currentPlatform === 'desktop';