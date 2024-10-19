import "./assets/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { getConfig } from "./config";
import { ApiClient } from "runnie-common";
import { registerServices } from "./services";

const app = createApp(App);

const host = window.location.hostname;
if (host === "localhost") {
  window.addEventListener("error", (event) => {
    console.error(`Uncaught Error: ${event.error}`);
  });

  window.addEventListener("unhandledrejection", (error) => {
    console.error(`Uncaught Promise Rejection: ${error.reason}`);
  });
}

const config = getConfig();
const apiClient = new ApiClient(config.apiURL);

registerServices(app, {
  apiClient,
});

const pinia = createPinia();
pinia.use(({ store }) => store.apiClient = apiClient)
app.use(pinia);
app.use(router);

app.mount("#app");
