import type { HttpCommunicator } from "@api/HttpCommunicator.ts";
import type {
  Id,
  PermissionName,
  Role,
  UserJson,
} from "@model/index.ts";

export interface CreateRoleRequest {
  name: string;
  permissions: PermissionName[];
}

export interface UpdateRoleRequest {
  name?: string;
  permissions?: PermissionName[];
}

export class AdminAuthRepo {
  constructor(private httpCommunicator: HttpCommunicator) {}

  async getUsers(lastId = 0, limit = 100): Promise<UserJson[]> {
    return this.httpCommunicator.get<UserJson[]>(
      `/auth/users?lastId=${lastId}&limit=${limit}`,
    );
  }

  async getRoles(lastId = 0, limit = 100): Promise<Role[]> {
    return this.httpCommunicator.get<Role[]>(
      `/auth/role?lastId=${lastId}&limit=${limit}`,
    );
  }

  async getPermissions(): Promise<PermissionName[]> {
    return this.httpCommunicator.get<PermissionName[]>(
      "/auth/role/permissions",
    );
  }

  async createRole(role: CreateRoleRequest): Promise<{ id: Id }> {
    return this.httpCommunicator.post<{ id: Id }, CreateRoleRequest>(
      "/auth/role",
      role,
    );
  }

  async updateRole(roleId: Id, role: UpdateRoleRequest): Promise<void> {
    await this.httpCommunicator.patch<UpdateRoleRequest>(
      `/auth/role/${roleId}`,
      role,
    );
  }

  async deleteRole(roleId: Id): Promise<void> {
    await this.httpCommunicator.delete(`/auth/role/${roleId}`);
  }

  async addRoleToUser(userId: Id, roleId: Id): Promise<void> {
    await this.httpCommunicator.put(`/auth/user/${userId}/role/${roleId}`);
  }

  async removeRoleFromUser(userId: Id, roleId: Id): Promise<void> {
    await this.httpCommunicator.delete(`/auth/user/${userId}/role/${roleId}`);
  }
}
