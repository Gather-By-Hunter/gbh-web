import { User } from "@model/index.ts";
import type { Id, PermissionName, Role } from "@model/index.ts";
import type { AdminAuthRepo } from "@repos/index.ts";

const ADMIN_PAGE_LIMIT = 100;

export interface AdminRoleUpdate {
  name?: string;
  permissions?: PermissionName[];
}

export class AdminAuthService {
  constructor(private repo: AdminAuthRepo) {}

  async getUsers(): Promise<User[]> {
    const users: User[] = [];
    let lastId = 0;
    let pageLength = ADMIN_PAGE_LIMIT;

    while (pageLength === ADMIN_PAGE_LIMIT) {
      const page = await this.repo.getUsers(lastId, ADMIN_PAGE_LIMIT);
      pageLength = page.length;

      for (const user of page) {
        users.push(new User(user, user.roles));
      }

      if (page.length > 0) {
        lastId = page[page.length - 1]!.id;
      }
    }

    return users;
  }

  async getRoles(): Promise<Role[]> {
    const roles: Role[] = [];
    let lastId = 0;
    let pageLength = ADMIN_PAGE_LIMIT;

    while (pageLength === ADMIN_PAGE_LIMIT) {
      const page = await this.repo.getRoles(lastId, ADMIN_PAGE_LIMIT);
      pageLength = page.length;
      roles.push(...page);

      if (page.length > 0) {
        lastId = page[page.length - 1]!.id;
      }
    }

    return roles;
  }

  async getPermissions(): Promise<PermissionName[]> {
    return this.repo.getPermissions();
  }

  async createRole(
    name: string,
    permissions: PermissionName[],
  ): Promise<Id> {
    const response = await this.repo.createRole({ name, permissions });
    return response.id;
  }

  async updateRole(roleId: Id, role: AdminRoleUpdate): Promise<void> {
    await this.repo.updateRole(roleId, role);
  }

  async deleteRole(roleId: Id): Promise<void> {
    await this.repo.deleteRole(roleId);
  }

  async addRoleToUser(userId: Id, roleId: Id): Promise<void> {
    await this.repo.addRoleToUser(userId, roleId);
  }

  async removeRoleFromUser(userId: Id, roleId: Id): Promise<void> {
    await this.repo.removeRoleFromUser(userId, roleId);
  }
}
