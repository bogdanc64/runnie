import { defineConfig } from 'wxt';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  srcDir: "src",
  manifest: {
    permissions: [
      'activeTab', 
      'windows', 
      'nativeMessaging',
      'alarms',
      'tabs',
      'webNavigation',
      'webRequest',
      'webRequestAuthProvider',
      'declarativeNetRequest',
      'debugger',
      'storage',
      'scripting',
      'downloads',
      'system.display',
      'offscreen'
    ],
    content_security_policy: {
      "extension_pages": "script-src 'self'; object-src 'self'"
    },
    externally_connectable: {
      matches: ["*://localhost:*/*"]
    }
  },
  vite: () => ({
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      },
    },
  }),
});
