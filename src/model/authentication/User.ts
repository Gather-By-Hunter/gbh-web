import type { Id } from "@model/Id.ts";
import type { PermissionName } from "./Permission.ts";
import type { Role } from "./Role.ts";

export interface UserData {
  id: Id;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export class User implements UserData {
  id: Id;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  roles: Role[];

  private permissions: Set<PermissionName>;

  /**
   * Creates the model class for User
   *
   * @param userData
   * @param roles Can be a list of all roles, or just the roles
   * required for this user. As long as all roles for this user
   * are provided, it will not care
   */
  constructor(userData: UserData, roles: Role[]) {
    this.id = userData.id;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.phoneNumber = userData.phoneNumber;
    this.email = userData.email;

    this.roles = roles;

    this.permissions = new Set();

    const roleIdToId: Record<Id, Role> = {};

    for (const role of roles) {
      roleIdToId[role.id] = role;

      for (const permission of role.permissions) {
        this.permissions.add(permission);
      }
    }
  }

  hasPermission(permission: PermissionName): boolean {
    return this.permissions.has(permission);
  }

  toJson(): UserData & { permissions: string[]; roles: Role[] } {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      permissions: Array.from(this.permissions).sort((a, b) =>
        a.localeCompare(b)
      ),
      roles: this.roles,
    };
  }
}
