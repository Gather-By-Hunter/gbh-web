import { User, IdLess } from "@model/index.ts";
import { PresenterView, ServicePresenter } from "./ServicePresenter.ts";
import { Services } from "@services/Services.ts";
import { Stores } from "@context/Context.ts";

export interface AccountView extends PresenterView {
  setUser: (user: User | null) => void;
}

export class AccountPresenter extends ServicePresenter<AccountView> {
  constructor(services: Services, stores: Stores, view: AccountView) {
    super(services, stores, view);
  }

  async logout() {
    await this.doAsyncAction(async () => {
      await this.authService.logout();
      this.view.navigate("/login");
      this.view.setUser(null);
    });
  }

  async updateUser(user: Partial<IdLess<User>>) {
    await this.doAsyncAction(async () => {
      await this.authService.updateUser(user);
      const currentUser = await this.authService.getUser();
      const updatedUser = new User(currentUser, currentUser.roles);
      this.view.setUser(updatedUser);
      this.view.displayMessage("User updated successfully!");
    });
  }
}
