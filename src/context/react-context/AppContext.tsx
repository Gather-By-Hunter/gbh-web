import { ContextFactory } from "@context/Context.ts";
import { Services } from "@services/Services.ts";
import { createContext, ReactNode, useState } from "react";

export interface AppContextType {
  services: Services;
}

export const AppContext = createContext<AppContextType>({
  services: {} as Services,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appState] = useState<AppContextType>(() => {
    const {
      services: {
        authService,
        categoryService,
        collectionService,
        eventTypeService,
        packageService,
        productService,
      },
    } = ContextFactory.context();

    return {
      services: {
        authService,
        categoryService,
        collectionService,
        eventTypeService,
        packageService,
        productService,
      },
    };
  });

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
