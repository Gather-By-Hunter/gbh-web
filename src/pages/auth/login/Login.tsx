import { Header, Main } from "@components/index.ts";
import { AuthContext, useLoginPresenter } from "@context/index.ts";
import { displayError, displayMessage } from "@pages/common.ts";
import { LoginData } from "@presenters/LoginPresenter.ts";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const viewRef = useRef({
    displayError,
    displayMessage,
    navigate,
    setUser,
    setLoading,
  });

  const view = viewRef.current;

  const presenter = useLoginPresenter(view);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: LoginData = {
      email,
      password,
    };

    await presenter.onSubmit(data);
  };

  return (
    <>
      <Header />
      <Main>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h1 className="mb-6 text-3xl font-bold text-center">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 cursor-pointer font-bold"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </Main>
    </>
  );
};

export default Login;
