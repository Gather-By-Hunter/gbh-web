import { Header, Main } from "@components/index.ts";
import { AppContext, AuthContext } from "@context/index.ts";
import type { User } from "@model/index.ts";
import { displayError, displayMessage } from "@pages/common.ts";
import { AccountPresenter, AccountView } from "@presenters/AccountPresenter.ts";
import { Pencil } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditableField: React.FC<{
  label: string;
  value: string;
  fieldName: string;
  onUpdate: (data: { [key: string]: string }) => void;
}> = ({ label, value, fieldName, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleUpdate = () => {
    onUpdate({ [fieldName]: currentValue });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  return (
    <div>
      <p className="font-medium">{label}</p>
      {isEditing ? (
        <div className="flex items-center space-x-2 mt-1">
          <input
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="text-gray-800 border rounded px-2 py-1 grow"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded cursor-pointer"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="relative mt-1">
          <p className="text-gray-800 grow py-1">{value}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-1/2 right-0 -translate-y-1/2 text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            <Pencil size={18} className="cursor-pointer" />
          </button>
        </div>
      )}
    </div>
  );
};

export const Account = () => {
  const { services } = useContext(AppContext);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const viewRef = useRef<AccountView>({
    displayError,
    displayMessage,
    navigate,
    setUser,
  });

  const view = viewRef.current;

  const [presenter] = useState(() => new AccountPresenter(services, view));

  useEffect(() => {
    presenter.onMount(user);
  }, [user]);

  if (!user) {
    return (
      <>
        <Header />
        <Main>Loading...</Main>
      </>
    );
  }

  const logout = () => {
    presenter.logout();
  };

  const handleUpdateUser = async (data: Partial<Omit<User, "id">>) => {
    await presenter.updateUser(data);
  };

  return (
    <>
      <Header />
      <Main>
        <div className="container mx-auto p-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full shrink-0 flex items-center justify-center">
                  <span className="text-3xl text-gray-600">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              >
                Logout
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <EditableField
                  label="First Name"
                  value={user.firstName}
                  fieldName="firstName"
                  onUpdate={handleUpdateUser}
                />
                <EditableField
                  label="Last Name"
                  value={user.lastName}
                  fieldName="lastName"
                  onUpdate={handleUpdateUser}
                />
                <EditableField
                  label="Email"
                  value={user.email}
                  fieldName="email"
                  onUpdate={handleUpdateUser}
                />
                <EditableField
                  label="Phone Number"
                  value={user.phoneNumber}
                  fieldName="phoneNumber"
                  onUpdate={handleUpdateUser}
                />
              </div>
            </div>

            {user.roles && user.roles.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Roles</h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  {user.roles.map((role) => (
                    <span
                      key={role.id.toString()}
                      className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Order History</h2>
              <div className="mt-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500">
                    This is a placeholder for your order history. Once you have
                    placed orders, they will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
};

export default Account;
