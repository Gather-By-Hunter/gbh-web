import { Services } from "@services/index.ts";
import { AuthPresenter, AuthView } from "./AuthPresenter.ts";
import { ServicePresenter } from "./ServicePresenter.ts";
import { Stores } from "@context/Context.ts";
import { User } from "@model/authentication/User.ts";

export type LoginData = {
  email: string;
  password: string;
};

export class LoginPresenter
  extends ServicePresenter<AuthView>
  implements AuthPresenter<LoginData>
{
  constructor(services: Services, stores: Stores, view: AuthView) {
    super(services, stores, view);
  }

  async onSubmit({ email: rawEmail, password }: LoginData): Promise<void> {
    await this.doAsyncAction(async () => {
      const email = this.validateEmail(rawEmail);

      await this.authService.login(email, password);

      const userData = await this.authService.getUser();
      const user = new User(userData, userData.roles);
      this.view.setUser(user);

      this.view.displayMessage("Welcome back!");

      this.view.navigate("/");
    });
  }

  private validateEmail(email: string): string {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      throw new Error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error("Invalid email format");
    }

    return trimmedEmail;
  }
}
