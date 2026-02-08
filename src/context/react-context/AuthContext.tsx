import { User } from "@model/index.ts";
import { PersistanceStore } from "@stores/PersistanceStore.ts";
import { createContext, ReactNode, useState } from "react";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const persistanceStore = new PersistanceStore();

  const [user, setUser] = useState<User | null>(() => {
    return persistanceStore.getUser();
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: (user: User | null) => {
          if (user) {
            persistanceStore.setUser(user);
          } else {
            persistanceStore.clearUser();
          }

          setUser(user);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
