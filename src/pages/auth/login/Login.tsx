import { InputField } from "@components/index.ts";
import { AppContext } from "@context/index.ts";
import { AuthView } from "@presenters/AuthPresenter.ts";
import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthPage from "../AuthPage.tsx";
import { LoginData, LoginPresenter } from "@presenters/LoginPresenter.ts";

export const Login: React.FC = () => {
  const { services } = useContext(AppContext);

  const transformFormData = (data: FormData): LoginData => {
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    return {
      email,
      password,
    };
  };

  const presenterFactory = (view: AuthView) => {
    return new LoginPresenter(services, view);
  };

  const afterForm = (
    <p className="mt-10 text-center text-sm text-gray-500">
      Don't have an account?{" "}
      <Link
        to="/register"
        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
      >
        Create account
      </Link>
    </p>
  );

  return (
    <AuthPage
      presenterFactory={presenterFactory}
      transformFormData={transformFormData}
      pageTitle="Sign in to your account"
      submitButtonText="Login"
      afterForm={afterForm}
    >
      <InputField
        label="Email address"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
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
    </AuthPage>
  );
};

export default Login;
