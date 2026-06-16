import { HttpCommunicator } from "@api/HttpCommunicator.ts";
import { createRepos } from "@repos/Repos.ts";
import { createServices, Services } from "@services/Services.ts";
import { PersistanceStore } from "@stores/PersistanceStore.ts";
import { HomeStore } from "@stores/home/HomeStore.ts";

export interface Stores {
  persistance: PersistanceStore;
  home: HomeStore;
}

export interface Context {
  services: Services;
  stores: Stores;
}

export const createDefaultContext = (): Context => {
  const persistanceStore = new PersistanceStore();

  const rawBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
  // Always ensure no trailing slash
  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  const httpCommunicator = new HttpCommunicator(baseUrl);

  const repos = createRepos(httpCommunicator);
  const services = createServices(repos, persistanceStore);

  const stores: Stores = {
    persistance: persistanceStore,
    home: new HomeStore(),
  };

  return {
    services,
    stores,
  };
};
