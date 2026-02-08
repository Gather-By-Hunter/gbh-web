import { User } from "@model/index.ts";
import { PresenterError, ServicePresenter } from "./ServicePresenter.ts";
import { AuthPresenter, AuthView } from "./AuthPresenter.ts";

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
};

export class RegisterPresenter
  extends ServicePresenter<AuthView>
  implements AuthPresenter<RegisterData>
{
  async onSubmit({
    firstName: rawFirstName,
    lastName: rawLastName,
    email: rawEmail,
    phoneNumber: rawPhoneNumber,
    password,
    passwordConfirmation,
  }: RegisterData): Promise<void> {
    await this.doAsyncAction(async () => {
      const [firstName, lastName] = this.validateNames(
        rawFirstName,
        rawLastName,
      );
      this.validatePasswords(password, passwordConfirmation);
      const email = this.validateEmail(rawEmail);
      const phoneNumber = this.validatePhoneNumber(rawPhoneNumber);

      await this.authService.register(
        {
          firstName,
          lastName,
          email,
          phoneNumber,
        },
        password,
      );

      const currentUser = await this.authService.getUser();

      const user = new User(currentUser, currentUser.roles);

      this.view.setUser(user);

      this.view.navigate("/");

      this.view.displayMessage("Registration successful!");
    });
  }

  private validateNames(firstName: string, lastName: string): [string, string] {
    return [firstName, lastName];
  }

  private validatePasswords(password: string, passwordConfirmation: string) {
    if (password !== passwordConfirmation) {
      throw new PresenterError("Passwords do not match");
    }

    if (password.length < 8) {
      throw new PresenterError("Password must be at least 8 characters long");
    }

    return password;
  }

  private validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new PresenterError("Invalid email address");
    }

    return email;
  }

  private validatePhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/\D/g, "");

    const phoneNumberRegex = /^\d{10}$/;

    if (!phoneNumberRegex.test(phoneNumber)) {
      throw new PresenterError("Invalid phone number");
    }

    return phoneNumber;
  }

  onMount(user: User | null) {
    if (user) {
      this.view.displayError("You are already logged in");
      this.view.navigate("/");
    }
  }
}
