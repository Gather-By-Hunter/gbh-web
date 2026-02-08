import { User } from "@model/index.ts";
import { PresenterView } from "./ServicePresenter.ts";

export interface AuthView extends PresenterView {
  setUser: (user: User) => void;
}

export interface AuthPresenter<T> {
  onMount(user: User | null): void;
  onUnmount(): void;
  onSubmit(data: T): Promise<void>;
}
