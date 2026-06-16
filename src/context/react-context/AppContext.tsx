import { createDefaultContext, Stores } from "@context/Context.ts";
import { Services } from "@services/Services.ts";
import { createContext, ReactNode, useMemo } from "react";

export interface AppContextType {
  services: Services;
  stores: Stores;
}

export const AppContext = createContext<AppContextType>({
  services: {} as Services,
  stores: {} as Stores,
});

const appContextVersion =
  (import.meta.hot?.data.appContextVersion as number | undefined) ?? 0;

if (import.meta.hot) {
  import.meta.hot.data.appContextVersion = appContextVersion + 1;
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const appState = useMemo<AppContextType>(() => {
    const { services, stores } = createDefaultContext();

    return {
      services,
      stores,
    };
  }, [appContextVersion]);

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
