import { User } from "@model/index.ts";
import { PresenterError, ServicePresenter } from "./ServicePresenter.ts";
import { AuthPresenter, AuthView } from "./AuthPresenter.ts";

export type LoginData = {
  email: string;
  password: string;
};

export class LoginPresenter
  extends ServicePresenter<AuthView>
  implements AuthPresenter<LoginData>
{
  async onSubmit({ email: rawEmail, password }: LoginData): Promise<void> {
    await this.doAsyncAction(async () => {
      const email = this.validateEmail(rawEmail);

      await this.authService.login(email, password);

      const currentUser = await this.authService.getUser();

      const user = new User(currentUser, currentUser.roles);

      this.view.setUser(user);

      this.view.navigate("/");

      this.view.displayMessage("Login successful!");
    });
  }

  private validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new PresenterError("Invalid email address");
    }

    return email;
  }

  onMount(user: User | null) {
    if (user) {
      this.view.displayError("You are already logged in");
      this.view.navigate("/");
    }
  }
}
