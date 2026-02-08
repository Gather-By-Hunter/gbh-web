import { Header, Main } from "@components/index.ts";
import { AuthContext } from "@context/index.ts";
import { displayError, displayMessage } from "@pages/common.ts";
import { AuthPresenter, AuthView } from "@presenters/AuthPresenter.ts";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthPage = <T,>({
  presenterFactory,
  transformFormData,
  pageTitle,
  submitButtonText,
  afterForm,
  children,
}: {
  presenterFactory: (view: AuthView) => AuthPresenter<T>;
  transformFormData: (data: FormData) => T;
  pageTitle: string;
  submitButtonText: string;
  afterForm: ReactNode;
  children: ReactNode;
}) => {
  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const viewRef = useRef<AuthView>({
    displayMessage,
    displayError,
    navigate,
    setUser,
  });

  const view = viewRef.current;

  const [presenter] = useState<AuthPresenter<T>>(() => presenterFactory(view));

  useEffect(() => {
    presenter.onMount(user);

    return () => presenter.onUnmount();
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    presenter.onSubmit(transformFormData(data));
  };

  return (
    <>
      <Header />
      <Main>
        <div className="flex min-h-full flex-1 flex-col justify-center">
          <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-gbh-cream px-6 py-12 pt-6 shadow sm:rounded-lg sm:px-12">
              <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gbh-black">
                {pageTitle}
              </h2>
              <form className="space-y-6" onSubmit={onSubmit}>
                {children}
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-gbh-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gbh-gold focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gbh-gold"
                  >
                    {submitButtonText}
                  </button>
                </div>
              </form>
            </div>
            {afterForm}
          </div>
        </div>
      </Main>
    </>
  );
};

export default AuthPage;
