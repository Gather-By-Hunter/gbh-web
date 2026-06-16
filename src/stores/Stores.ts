import { HomeStore } from "./home/index.ts";
import { PersistanceStore } from "./PersistanceStore.ts";

export interface Stores {
  home: HomeStore;
  persistance: PersistanceStore;
}
