import { User } from "@model/index.ts";
import { AuthContextPresenter } from "@presenters/AuthContextPresenter.ts";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppContext } from "./AppContext.tsx";
import { displayError, displayMessage } from "@pages/common.ts";
import { useNavigate } from "react-router-dom";
import { useStore } from "@stores/useStore.ts";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { services, stores } = useContext(AppContext);
  const navigate = useNavigate();

  // Sync with the persistence store
  const persistanceStore = useStore(stores.persistance);

  const [user, setUser] = useState<User | null>(() =>
    persistanceStore.getUser(),
  );

  const [presenter] = useState(
    () =>
      new AuthContextPresenter(services, stores, {
        setUser,
        displayError,
        displayMessage,
        navigate,
      }),
  );

  useEffect(() => {
    presenter.onMount();

    return () => presenter.onUnmount();
  }, [presenter]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: (newUser: User | null) => {
          if (newUser) {
            stores.persistance.setUser(newUser);
          } else {
            stores.persistance.clearUser();
          }

          setUser(newUser);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
