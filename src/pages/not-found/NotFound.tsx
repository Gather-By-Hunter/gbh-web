import { Header, Main } from "@components/index.ts";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  return (
    <>
      <Header />
      <Main>
        <h1>404 | Page Not Found</h1>
        <Link
          to="/"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Return home?
        </Link>
      </Main>
    </>
  );
};

export default NotFound;
