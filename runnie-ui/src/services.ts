import type { App } from 'vue';
import type { ApiClient } from 'runnie-common';

export interface Services {
  apiClient: ApiClient;
  // Add other services here as needed
}

export const registerServices = (app: App, services: Services) => {
  for (const [key, service] of Object.entries(services)) {
    app.provide(key, service);
  }
};