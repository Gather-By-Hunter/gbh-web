import { RentalStore } from "./rental/index.ts";
import { HomeStore } from "./home/index.ts";
import { PersistanceStore } from "./PersistanceStore.ts";

export interface Stores {
  rental: RentalStore;
  home: HomeStore;
  persistance: PersistanceStore;
}
