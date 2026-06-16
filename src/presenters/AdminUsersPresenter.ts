import type {
  Id,
  PermissionName,
  Role,
  User,
} from "@model/index.ts";
import type { Services } from "@services/Services.ts";
import type { Stores } from "@context/Context.ts";
import { PresenterView, ServicePresenter } from "./ServicePresenter.ts";

export interface AdminUsersView extends PresenterView {
  setUsers: (users: User[]) => void;
  setRoles: (roles: Role[]) => void;
  setPermissions: (permissions: PermissionName[]) => void;
  setLoading: (loading: boolean) => void;
}

export class AdminUsersPresenter extends ServicePresenter<AdminUsersView> {
  constructor(
    private readonly services: Services,
    stores: Stores,
    view: AdminUsersView,
  ) {
    super(services, stores, view);
  }

  async loadInitialData(
    canViewUsers: boolean,
    canManageRoles: boolean,
  ): Promise<void> {
    this.view.setLoading(true);
    await this.doAsyncAction(async () => {
      const loads: Promise<void>[] = [];
      if (canViewUsers) {
        loads.push(this.loadUsers());
      }
      if (canManageRoles) {
        loads.push(this.loadRolesAndPermissions());
      }
      await Promise.all(loads);
    });
    this.view.setLoading(false);
  }

  async loadUsers(): Promise<void> {
    const users = await this.services.adminAuthService.getUsers();
    this.view.setUsers(
      users.sort((a, b) => a.email.localeCompare(b.email)),
    );
  }

  async loadRolesAndPermissions(): Promise<void> {
    const [roles, permissions] = await Promise.all([
      this.services.adminAuthService.getRoles(),
      this.services.adminAuthService.getPermissions(),
    ]);

    this.view.setRoles(roles.sort((a, b) => a.name.localeCompare(b.name)));
    this.view.setPermissions(
      permissions.sort((a, b) => a.localeCompare(b)),
    );
  }

  async assignRole(userId: Id, roleId: Id): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.services.adminAuthService.addRoleToUser(userId, roleId);
      await this.loadUsers();
      this.view.displayMessage("Role assigned");
    });
  }

  async removeRole(userId: Id, roleId: Id): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.services.adminAuthService.removeRoleFromUser(userId, roleId);
      await this.loadUsers();
      this.view.displayMessage("Role removed");
    });
  }

  async createRole(
    name: string,
    permissions: PermissionName[],
  ): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.services.adminAuthService.createRole(name, permissions);
      await this.loadRolesAndPermissions();
      this.view.displayMessage("Role created");
    });
  }

  async updateRole(
    roleId: Id,
    name: string,
    permissions: PermissionName[],
  ): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.services.adminAuthService.updateRole(roleId, {
        name,
        permissions,
      });
      await Promise.all([this.loadRolesAndPermissions(), this.loadUsers()]);
      this.view.displayMessage("Role updated");
    });
  }

  async deleteRole(roleId: Id): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.services.adminAuthService.deleteRole(roleId);
      await Promise.all([this.loadRolesAndPermissions(), this.loadUsers()]);
      this.view.displayMessage("Role deleted");
    });
  }
}
