import { Header, Main } from "@components/index.ts";
import { AppContext, AuthContext } from "@context/index.ts";
import { displayError, displayMessage } from "@pages/common.ts";
import { AdminPresenter, AdminView } from "@presenters/AdminPresenter.ts";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const { services } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const viewRef = useRef<AdminView>({
    displayError,
    displayMessage,
    navigate,
  });

  const view = viewRef.current;

  const [presenter] = useState(() => new AdminPresenter(services, view));

  useEffect(() => {
    presenter.onMount(user);
  }, [user]);

  return (
    <>
      <Header />
      <Main></Main>
    </>
  );
};

export default Admin;
