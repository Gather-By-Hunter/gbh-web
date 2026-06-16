import { User } from "@model/index.ts";
import { PresenterView, ServicePresenter } from "./ServicePresenter.ts";

export interface AuthContextView extends PresenterView {
  setUser: (user: User | null) => void;
}

export class AuthContextPresenter extends ServicePresenter<AuthContextView> {
  private mountedPromise: Promise<void> = Promise.resolve();

  async onMount(): Promise<void> {
    this.mountedPromise = this.mountedPromise.then(() => this.checkAuth());
  }

  async checkAuth() {
    const persistanceStore = this.stores.persistance;
    const user = persistanceStore.getUser();

    const signInAgain = () => {
      persistanceStore.clearUser();
      this.view.setUser(null);
    };

    if (user) {
      this.view.setUser(user);
    }

    try {
      await this.authService.refresh();
      const currentUser = await this.authService.getUser();
      const refreshedUser = new User(currentUser, currentUser.roles);
      this.stores.persistance.setUser(refreshedUser);
      this.view.setUser(refreshedUser);
    } catch {
      signInAgain();
    }
  }
}
