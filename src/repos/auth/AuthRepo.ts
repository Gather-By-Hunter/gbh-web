import type { HttpCommunicator } from "@api/HttpCommunicator.ts";
import type {
  PermissionName,
  Role,
  UserData,
  IdLess,
} from "@model/index.ts";

export class AuthRepo {
  constructor(private httpCommunicator: HttpCommunicator) {}

  async register(user: IdLess<UserData>, password: string): Promise<void> {
    await this.httpCommunicator.post<void>("/auth/user", {
      ...user,
      password,
    });
  }

  async login(email: string, password: string): Promise<void> {
    await this.httpCommunicator.post<void>("/auth/user/session", {
      email,
      password,
    });
  }

  async logout() {
    await this.httpCommunicator.delete("/auth/user/session");
  }

  async refresh(): Promise<void> {
    await this.httpCommunicator.put<void>("/auth/user/session");
  }

  async getUser() {
    const user = await this.httpCommunicator.get<
      UserData & { permissions: PermissionName[]; roles: Role[] }
    >("/auth/user");

    return user;
  }

  async updateUser(user: Partial<IdLess<UserData>>, password?: string) {
    const payload: Record<string, string | number> = {
      ...user,
    };

    if (password) {
      payload.password = password;
    }

    await this.httpCommunicator.patch("/auth/user", payload);
  }
}
