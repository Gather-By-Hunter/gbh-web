import { Header, Main } from "@components/index.ts";
import { useAdminUsersPresenter } from "@context/react-context/presenterHooks.ts";
import { AuthContext } from "@context/index.ts";
import type { Id, PermissionName, Role, User } from "@model/index.ts";
import { Permission } from "@model/index.ts";
import { displayError, displayMessage } from "@pages/common.ts";
import {
  ArrowLeft,
  Check,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AdminUsersView } from "@presenters/AdminUsersPresenter.ts";
import { adminStyles } from "./adminStyles.ts";

interface AdminUsersPageProps {
  initialSection?: "users" | "roles";
}

interface RoleDraft {
  name: string;
  permissions: PermissionName[];
}

const roleToDraft = (role: Role): RoleDraft => ({
  name: role.name,
  permissions: [...role.permissions],
});

const togglePermission = (
  permissions: PermissionName[],
  permission: PermissionName,
): PermissionName[] => {
  return permissions.includes(permission)
    ? permissions.filter((current) => current !== permission)
    : [...permissions, permission].sort((a, b) => a.localeCompare(b));
};

const getUserName = (user: User): string =>
  `${user.firstName} ${user.lastName}`.trim() || user.email;

const getUserPermissions = (user: User): PermissionName[] =>
  user.toJson().permissions;

const PermissionGrid = ({
  allPermissions,
  selectedPermissions,
  disabled,
  onToggle,
}: {
  allPermissions: PermissionName[];
  selectedPermissions: PermissionName[];
  disabled?: boolean;
  onToggle: (permission: PermissionName) => void;
}) => {
  return (
    <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto rounded-md border border-gbh-gold/20 bg-gbh-cream/45 p-3 md:grid-cols-2">
      {allPermissions.map((permission) => {
        const checked = selectedPermissions.includes(permission);
        return (
          <label
            key={permission}
            className="flex min-w-0 items-center gap-2 rounded-md bg-gbh-white/80 px-2 py-1.5 font-montserrat-light text-xs text-gbh-black"
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={() => onToggle(permission)}
              className="h-4 w-4 accent-gbh-green"
            />
            <span className="truncate" title={permission}>
              {permission}
            </span>
          </label>
        );
      })}
    </div>
  );
};

const RoleEditor = ({
  role,
  allPermissions,
  onSave,
  onDelete,
}: {
  role: Role;
  allPermissions: PermissionName[];
  onSave: (roleId: Id, draft: RoleDraft) => void;
  onDelete: (roleId: Id) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<RoleDraft>(() => roleToDraft(role));

  useEffect(() => {
    setDraft(roleToDraft(role));
  }, [role]);

  return (
    <div className={`${adminStyles.insetPanel} p-4`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              className={adminStyles.input}
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          ) : (
            <h3 className={`${adminStyles.heading} truncate text-2xl`}>
              {role.name}
            </h3>
          )}
          <p className={`${adminStyles.bodyText} mt-1 text-xs`}>
            {role.permissions.length} permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                type="button"
                className={adminStyles.secondaryButton}
                onClick={() => {
                  setDraft(roleToDraft(role));
                  setEditing(false);
                }}
                title="Cancel"
              >
                <X size={16} />
              </button>
              <button
                type="button"
                className={adminStyles.primaryButton}
                onClick={() => {
                  onSave(role.id, draft);
                  setEditing(false);
                }}
                title="Save role"
              >
                <Save size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={adminStyles.secondaryButton}
                onClick={() => setEditing(true)}
                title="Edit role"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                className={adminStyles.dangerButton}
                onClick={() => onDelete(role.id)}
                title="Delete role"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <div className="mt-4">
          <PermissionGrid
            allPermissions={allPermissions}
            selectedPermissions={draft.permissions}
            onToggle={(permission) =>
              setDraft((current) => ({
                ...current,
                permissions: togglePermission(
                  current.permissions,
                  permission,
                ),
              }))
            }
          />
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {role.permissions.slice(0, 10).map((permission) => (
            <span
              key={permission}
              className="rounded-md bg-gbh-white px-2 py-1 font-montserrat-light text-xs text-gbh-black"
            >
              {permission}
            </span>
          ))}
          {role.permissions.length > 10 && (
            <span className="rounded-md bg-gbh-white px-2 py-1 font-montserrat-light text-xs text-gbh-black/60">
              +{role.permissions.length - 10}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const AdminUsersPage = ({
  initialSection = "users",
}: AdminUsersPageProps) => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const canViewUsers =
    currentUser?.hasPermission(Permission.ADMIN_USERS_VIEW) ?? false;
  const canManageRoles =
    currentUser?.hasPermission(Permission.ADMIN_ROLES_VIEW) ?? false;
  const rolesFirst = initialSection === "roles";

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionName[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<Id | null>(null);
  const [newRole, setNewRole] = useState<RoleDraft>({
    name: "",
    permissions: [],
  });

  const viewRef = useRef<AdminUsersView>({
    displayError,
    displayMessage,
    navigate,
    setLoading,
    setUsers,
    setRoles,
    setPermissions,
  });

  const presenter = useAdminUsersPresenter(viewRef.current);

  useEffect(() => {
    presenter.loadInitialData(canViewUsers, canManageRoles);
  }, [presenter, canViewUsers, canManageRoles]);

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      setSelectedUserId(users[0]!.id);
    }
  }, [selectedUserId, users]);

  const selectedUser = useMemo(
    () => users.find((item) => item.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const availableRoles = useMemo(() => {
    if (!selectedUser) return roles;
    const assignedRoleIds = new Set(selectedUser.roles.map((role) => role.id));
    return roles.filter((role) => !assignedRoleIds.has(role.id));
  }, [roles, selectedUser]);

  const userPermissions = selectedUser
    ? getUserPermissions(selectedUser)
    : [];

  return (
    <>
      <Header />
      <Main className="bg-gbh-cream px-4 py-6 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className={adminStyles.secondaryButton}
                title="Back to admin"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <p className={adminStyles.label}>Admin</p>
                <h1 className={`${adminStyles.heading} text-4xl md:text-5xl`}>
                  Users & Access
                </h1>
              </div>
            </div>
            {loading && (
              <span className="rounded-md bg-gbh-gold/10 px-3 py-1.5 font-montserrat-light text-sm text-gbh-green">
                Loading
              </span>
            )}
          </div>

          <div className="grid min-h-[calc(100vh-13rem)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.65fr)]">
            {canViewUsers && (
              <section
                className={`${adminStyles.panel} min-w-0 p-4`}
                style={{ order: rolesFirst ? 2 : 1 }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <Users className="text-gbh-green" size={22} />
                  <h2 className={`${adminStyles.heading} text-3xl`}>
                    Users
                  </h2>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(280px,0.7fr)_minmax(0,1fr)]">
                  <div className="overflow-hidden rounded-lg border border-gbh-gold/20">
                    <div className="max-h-[38rem] overflow-y-auto">
                      {users.map((user) => {
                        const isSelected = user.id === selectedUserId;
                        return (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => setSelectedUserId(user.id)}
                            className={`flex w-full items-start gap-3 border-b border-gbh-gold/15 px-4 py-3 text-left transition last:border-b-0 ${
                              isSelected
                                ? "bg-gbh-gold/15"
                                : "bg-gbh-white hover:bg-gbh-cream"
                            }`}
                          >
                            <div className="rounded-md border border-gbh-gold/25 bg-gbh-cream p-2 text-gbh-green">
                              <UserRound size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-montserrat-light text-sm font-bold text-gbh-black">
                                {getUserName(user)}
                              </p>
                              <p className="truncate font-montserrat-light text-xs text-gbh-black/70">
                                {user.email}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {user.roles.slice(0, 3).map((role) => (
                                  <span
                                    key={role.id}
                                    className="rounded-md bg-gbh-cream px-2 py-0.5 font-montserrat-light text-xs text-gbh-green"
                                  >
                                    {role.name}
                                  </span>
                                ))}
                                {user.roles.length > 3 && (
                                  <span className="rounded-md bg-gbh-cream px-2 py-0.5 font-montserrat-light text-xs text-gbh-green">
                                    +{user.roles.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`${adminStyles.insetPanel} min-w-0 p-4`}>
                    {selectedUser ? (
                      <div className="flex flex-col gap-5">
                        <div>
                          <p className={adminStyles.label}>Selected User</p>
                          <h3 className={`${adminStyles.heading} text-3xl`}>
                            {getUserName(selectedUser)}
                          </h3>
                          <div className="mt-3 grid gap-2 font-montserrat-light text-sm text-gbh-black md:grid-cols-2">
                            <span>{selectedUser.email}</span>
                            <span>{selectedUser.phoneNumber}</span>
                          </div>
                        </div>

                        <div>
                          <p className={adminStyles.label}>Roles</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.roles.map((role) => (
                              <span
                                key={role.id}
                                className="inline-flex items-center gap-2 rounded-md bg-gbh-white px-3 py-1.5 font-montserrat-light text-sm text-gbh-black"
                              >
                                {role.name}
                                {canManageRoles && (
                                  <button
                                    type="button"
                                    className="text-red-700 hover:text-red-900"
                                    onClick={() =>
                                      presenter.removeRole(
                                        selectedUser.id,
                                        role.id,
                                      )
                                    }
                                    title={`Remove ${role.name}`}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </span>
                            ))}
                            {selectedUser.roles.length === 0 && (
                              <span className="font-montserrat-light text-sm text-gbh-black/70">
                                No roles assigned.
                              </span>
                            )}
                          </div>
                        </div>

                        {canManageRoles && (
                          <div>
                            <p className={adminStyles.label}>Assign Role</p>
                            <div className="flex flex-wrap gap-2">
                              {availableRoles.map((role) => (
                                <button
                                  key={role.id}
                                  type="button"
                                  className={adminStyles.secondaryButton}
                                  onClick={() =>
                                    presenter.assignRole(
                                      selectedUser.id,
                                      role.id,
                                    )
                                  }
                                >
                                  <Plus size={16} />
                                  {role.name}
                                </button>
                              ))}
                              {availableRoles.length === 0 && (
                                <span className="font-montserrat-light text-sm text-gbh-black/70">
                                  All roles assigned.
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className={adminStyles.label}>Permissions</p>
                          <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto">
                            {userPermissions.map((permission) => (
                              <span
                                key={permission}
                                className="rounded-md bg-gbh-white px-2 py-1 font-montserrat-light text-xs text-gbh-black"
                              >
                                {permission}
                              </span>
                            ))}
                            {userPermissions.length === 0 && (
                              <span className="font-montserrat-light text-sm text-gbh-black/70">
                                No permissions resolved.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className={adminStyles.bodyText}>
                        Select a user to inspect access.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {canManageRoles && (
              <section
                className={`${adminStyles.panel} flex min-w-0 flex-col gap-4 p-4`}
                style={{ order: rolesFirst ? 1 : 2 }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-gbh-green" size={22} />
                  <h2 className={`${adminStyles.heading} text-3xl`}>
                    Roles
                  </h2>
                </div>

                <div className={`${adminStyles.insetPanel} p-4`}>
                  <p className={adminStyles.label}>Create Role</p>
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      className={adminStyles.input}
                      placeholder="Role name"
                      value={newRole.name}
                      onChange={(event) =>
                        setNewRole((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      className={adminStyles.primaryButton}
                      disabled={!newRole.name.trim()}
                      onClick={() => {
                        presenter.createRole(
                          newRole.name.trim(),
                          newRole.permissions,
                        );
                        setNewRole({ name: "", permissions: [] });
                      }}
                    >
                      <Check size={16} />
                      Create
                    </button>
                  </div>
                  <PermissionGrid
                    allPermissions={permissions}
                    selectedPermissions={newRole.permissions}
                    onToggle={(permission) =>
                      setNewRole((current) => ({
                        ...current,
                        permissions: togglePermission(
                          current.permissions,
                          permission,
                        ),
                      }))
                    }
                  />
                </div>

                <div className="flex max-h-[44rem] flex-col gap-3 overflow-y-auto pr-1">
                  {roles.map((role) => (
                    <RoleEditor
                      key={role.id}
                      role={role}
                      allPermissions={permissions}
                      onSave={(roleId, draft) =>
                        presenter.updateRole(
                          roleId,
                          draft.name.trim(),
                          draft.permissions,
                        )
                      }
                      onDelete={(roleId) => presenter.deleteRole(roleId)}
                    />
                  ))}
                </div>
              </section>
            )}

            {!canViewUsers && !canManageRoles && (
              <section className={`${adminStyles.panel} p-8`}>
                <p className={adminStyles.bodyText}>
                  You do not have access to this admin page.
                </p>
              </section>
            )}
          </div>
        </div>
      </Main>
    </>
  );
};

export default AdminUsersPage;
