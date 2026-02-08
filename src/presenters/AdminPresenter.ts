import { User } from "@model/index.ts";
import { PresenterView, ServicePresenter } from "./ServicePresenter.ts";

export interface AdminView extends PresenterView {}

export class AdminPresenter extends ServicePresenter<AdminView> {
  onMount(user: User | null): void {
    if (!user) {
      this.view.displayError("You are not logged in");
      this.view.navigate("/login");
    } else if (!user.roles.length) {
      this.view.displayError("You are not an admin");
      this.view.navigate("/");
    }
  }
}
