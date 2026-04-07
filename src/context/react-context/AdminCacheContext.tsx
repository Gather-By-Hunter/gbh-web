import { createContext, ReactNode, useRef } from "react";
import { RentalModel } from "@model/index.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";

export interface AdminCache {
  modelCache: Map<string, RentalModel>;
  allModelsCache: Map<ModelType, RentalModel[]>;
}

export const AdminCacheContext = createContext<{
  cache: React.MutableRefObject<AdminCache>;
} | null>(null);

export const AdminCacheProvider = ({ children }: { children: ReactNode }) => {
  const cache = useRef<AdminCache>({
    modelCache: new Map(),
    allModelsCache: new Map(),
  });

  return (
    <AdminCacheContext.Provider value={{ cache }}>
      {children}
    </AdminCacheContext.Provider>
  );
};
