import { useSyncExternalStore } from "react";
import { Store } from "./Store.ts";

export function useStore<T extends Store>(store: T): T {
  useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.getSnapshot(),
  );

  return store;
}
