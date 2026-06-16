import { Services } from "@services/index.ts";
import { AuthPresenter, AuthView } from "./AuthPresenter.ts";
import { ServicePresenter } from "./ServicePresenter.ts";
import { Stores } from "@context/Context.ts";
import { User } from "@model/authentication/User.ts";

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
  constructor(services: Services, stores: Stores, view: AuthView) {
    super(services, stores, view);
  }

  async onSubmit({
    firstName: rawFirstName,
    lastName: rawLastName,
    email: rawEmail,
    phoneNumber: rawPhoneNumber,
    password,
    passwordConfirmation,
  }: RegisterData): Promise<void> {
    await this.doAsyncAction(async () => {
      const email = this.validateEmail(rawEmail);
      const firstName = this.validateName(rawFirstName, "First name");
      const lastName = this.validateName(rawLastName, "Last name");
      const phoneNumber = this.validatePhoneNumber(rawPhoneNumber);

      if (password !== passwordConfirmation) {
        throw new Error("Passwords do not match");
      }

      await this.authService.register(
        {
          email,
          firstName,
          lastName,
          phoneNumber,
        },
        password,
      );

      const userData = await this.authService.getUser();
      const user = new User(userData, userData.roles);
      this.view.setUser(user);

      this.view.displayMessage("Account created successfully!");
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

  private validateName(name: string, fieldName: string): string {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error(`${fieldName} is required`);
    }

    return trimmedName;
  }

  private validatePhoneNumber(phoneNumber: string): string {
    const trimmedPhoneNumber = phoneNumber.trim().replace(/\D/g, "");

    if (trimmedPhoneNumber.length !== 10) {
      throw new Error("Phone number must be 10 digits");
    }

    return trimmedPhoneNumber;
  }
}
