import { User } from "@model/index.ts";
import { PresenterView, ServicePresenter } from "./ServicePresenter.ts";

export interface AccountView extends PresenterView {
  setUser: (user: User | null) => void;
}

export class AccountPresenter extends ServicePresenter<AccountView> {
  async logout() {
    await this.doAsyncAction(async () => {
      await this.authService.logout();
      this.view.setUser(null);
      this.view.navigate("/login");
    });
  }

  async updateUser(user: Partial<Omit<User, "id">>) {
    await this.doAsyncAction(async () => {
      await this.authService.updateUser(user);
      const currentUser = await this.authService.getUser();
      const updatedUser = new User(currentUser, currentUser.roles);
      this.view.setUser(updatedUser);
      this.view.displayMessage("User updated successfully!");
    });
  }
}
