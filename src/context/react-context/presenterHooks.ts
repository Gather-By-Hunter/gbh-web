import type { AccountView } from "@presenters/AccountPresenter.ts";
import { AccountPresenter } from "@presenters/AccountPresenter.ts";
import type { AdminView } from "@presenters/AdminPresenter.ts";
import { AdminPresenter } from "@presenters/AdminPresenter.ts";
import type { AdminUsersView } from "@presenters/AdminUsersPresenter.ts";
import { AdminUsersPresenter } from "@presenters/AdminUsersPresenter.ts";
import type { HomeView } from "@presenters/HomePresenter.ts";
import { HomePresenter } from "@presenters/HomePresenter.ts";
import type { AuthView } from "@presenters/AuthPresenter.ts";
import { LoginPresenter } from "@presenters/LoginPresenter.ts";
import { RegisterPresenter } from "@presenters/RegisterPresenter.ts";
import { usePresenter } from "./usePresenter.ts";

export const useAccountPresenter = (view: AccountView): AccountPresenter =>
  usePresenter(
    ({ services, stores }) => new AccountPresenter(services, stores, view),
  );

export const useAdminPresenter = (view: AdminView): AdminPresenter =>
  usePresenter(
    ({ services, stores }) => new AdminPresenter(services, stores, view),
  );

export const useAdminUsersPresenter = (
  view: AdminUsersView,
): AdminUsersPresenter =>
  usePresenter(
    ({ services, stores }) =>
      new AdminUsersPresenter(services, stores, view),
  );

export const useHomePresenter = (view: HomeView): HomePresenter =>
  usePresenter(
    ({ services, stores }) => new HomePresenter(services, stores, view),
  );

export const useLoginPresenter = (view: AuthView): LoginPresenter =>
  usePresenter(
    ({ services, stores }) => new LoginPresenter(services, stores, view),
  );

export const useRegisterPresenter = (view: AuthView): RegisterPresenter =>
  usePresenter(
    ({ services, stores }) => new RegisterPresenter(services, stores, view),
  );
