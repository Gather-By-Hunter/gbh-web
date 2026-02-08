import { InputField } from "@components/index.ts";
import { AppContext } from "@context/index.ts";
import { AuthView } from "@presenters/AuthPresenter.ts";
import {
  RegisterData,
  RegisterPresenter,
} from "@presenters/RegisterPresenter.ts";
import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthPage from "../AuthPage.tsx";

export const Register: React.FC = () => {
  const { services } = useContext(AppContext);

  const transformFormData = (data: FormData): RegisterData => {
    const firstName = data.get("first-name") as string;
    const lastName = data.get("last-name") as string;
    const email = data.get("email") as string;
    const phoneNumber = data.get("phone-number") as string;
    const password = data.get("password") as string;
    const passwordConfirmation = data.get("confirm-password") as string;

    return {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      passwordConfirmation,
    };
  };

  const presenterFactory = (view: AuthView) => {
    return new RegisterPresenter(services, view);
  };

  const afterForm = (
    <p className="mt-10 text-center text-sm text-gray-500">
      Already a member?{" "}
      <Link
        to="/login"
        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
      >
        Sign in
      </Link>
    </p>
  );

  return (
    <AuthPage
      presenterFactory={presenterFactory}
      transformFormData={transformFormData}
      submitButtonText="Register"
      pageTitle="Create a new account"
      afterForm={afterForm}
    >
      <InputField
        label="First Name"
        id="first-name"
        name="first-name"
        type="text"
        autoComplete="given-name"
        required
      />
      <InputField
        label="Last Name"
        id="last-name"
        name="last-name"
        type="text"
        autoComplete="family-name"
        required
      />
      <InputField
        label="Email address"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <InputField
        label="Phone Number"
        id="phone-number"
        name="phone-number"
        type="text"
        autoComplete="phone-number"
        required
      />
      <InputField
        label="Password"
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
      />
      <InputField
        label="Confirm Password"
        id="confirm-password"
        name="confirm-password"
        type="password"
        autoComplete="new-password"
        required
      />
    </AuthPage>
  );
};

export default Register;
