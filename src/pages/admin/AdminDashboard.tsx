import { Header, Main } from "@components/index.ts";
import {
  ClipboardList,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useContext, type ComponentType } from "react";
import { AuthContext } from "@context/index.ts";
import { Permission, type PermissionName } from "@model/index.ts";
import { Link } from "react-router-dom";
import { adminStyles } from "./adminStyles.ts";

interface AdminDashboardLink {
  title: string;
  description: string;
  to: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  permission: PermissionName;
}

const adminDashboardLinks: AdminDashboardLink[] = [
  {
    title: "Catalog",
    description:
      "Manage rental products, packages, collections, media, and SEO tags.",
    to: "/admin/catalog",
    icon: Package,
    permission: Permission.ADMIN_CATALOG_VIEW,
  },
  {
    title: "Users",
    description: "Review customers, team members, and account access.",
    to: "/admin/users",
    icon: Users,
    permission: Permission.ADMIN_USERS_VIEW,
  },
  {
    title: "Roles & Permissions",
    description: "Manage role assignments and permission bundles.",
    to: "/admin/roles",
    icon: ShieldCheck,
    permission: Permission.ADMIN_ROLES_VIEW,
  },
  {
    title: "Orders",
    description: "Track rental requests, reservations, and fulfillment status.",
    to: "/admin/orders",
    icon: ClipboardList,
    permission: Permission.ADMIN_ORDERS_VIEW,
  },
];

export const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const visibleLinks = adminDashboardLinks.filter((item) =>
    user?.hasPermission(item.permission),
  );

  return (
    <>
      <Header />
      <Main className="bg-gbh-cream px-6 py-10 md:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div>
            <p className={`${adminStyles.label} mb-2`}>Admin</p>
            <div className="flex items-center gap-3">
              <LayoutDashboard className="text-gbh-gold" size={36} />
              <h1 className={`${adminStyles.heading} text-5xl md:text-6xl`}>
                Dashboard
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {visibleLinks.map((item) => {
              const Icon = item.icon;
              const className = `${adminStyles.panel} flex min-h-48 flex-col justify-between p-5 transition hover:border-gbh-gold hover:shadow-md`;
              const body = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className={`${adminStyles.heading} text-3xl`}>
                        {item.title}
                      </h2>
                      <p className={`${adminStyles.bodyText} mt-3 text-sm`}>
                        {item.description}
                      </p>
                    </div>
                    <div className="rounded-md border border-gbh-gold/30 bg-gbh-cream p-2 text-gbh-green">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                  <span className={adminStyles.subtleButton}>Open</span>
                </>
              );

              return (
                <Link key={item.title} to={item.to} className={className}>
                  {body}
                </Link>
              );
            })}
          </div>
          {visibleLinks.length === 0 && (
            <div className={`${adminStyles.panel} p-8`}>
              <p className={adminStyles.bodyText}>
                You do not have access to any admin pages.
              </p>
            </div>
          )}
        </div>
      </Main>
    </>
  );
};

export default AdminDashboard;
