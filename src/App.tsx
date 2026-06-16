import { AppProvider, AuthProvider } from "@context/index.ts";
import {
  Collections,
  Home,
  Login,
  MatchYourVibe,
  NotFound,
  PinterestPrivacyPolicy,
  PrivacyPolicy,
  Account,
  Register,
  AdminCatalog,
  AdminDashboard,
  AdminUsersPage,
  AdminPlaceholderPage,
} from "@pages/index.ts";
import { useContext, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthContext } from "@context/index.ts";
import { Permission, type PermissionName } from "@model/index.ts";

const adminPagePermissions = [
  Permission.ADMIN_CATALOG_VIEW,
  Permission.ADMIN_USERS_VIEW,
  Permission.ADMIN_ROLES_VIEW,
  Permission.ADMIN_ORDERS_VIEW,
];

const AdminRoute = ({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: PermissionName;
}) => {
  const { user } = useContext(AuthContext);

  const hasAccess = permission
    ? user?.hasPermission(permission)
    : user?.hasPermission(Permission.ADMIN_DASHBOARD_VIEW) ||
      user?.hasAnyPermission(adminPagePermissions);

  return hasAccess ? children : <Navigate to="/" replace />;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gbh-cream text-gbh-black">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/catalog"
          element={
            <AdminRoute permission={Permission.ADMIN_CATALOG_VIEW}>
              <AdminCatalog />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute permission={Permission.ADMIN_USERS_VIEW}>
              <AdminUsersPage initialSection="users" />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <AdminRoute permission={Permission.ADMIN_ROLES_VIEW}>
              <AdminUsersPage initialSection="roles" />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute permission={Permission.ADMIN_ORDERS_VIEW}>
              <AdminPlaceholderPage title="Orders" />
            </AdminRoute>
          }
        />
        <Route path="/account" element={<Account />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/match-your-vibe" element={<MatchYourVibe />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/pinterest/privacy-policy"
          element={<PinterestPrivacyPolicy />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => (
  <>
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <Toaster />
          <AppContent />
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  </>
);

export default App;
