import type { HttpCommunicator } from "@api/HttpCommunicator.ts";
import type { Role, UserData } from "@model/index.ts";

export class AuthRepo {
  constructor(private httpCommunicator: HttpCommunicator) {}

  async register(user: Omit<UserData, "id">, password: string) {
    const { authToken } = await this.httpCommunicator.post<{
      authToken: string;
    }>("/auth/user", {
      ...user,
      password,
    });

    return authToken;
  }

  async login(email: string, password: string) {
    const { authToken } = await this.httpCommunicator.post<{
      authToken: string;
    }>("/auth/user/session", {
      email,
      password,
    });

    return authToken;
  }

  async logout() {
    await this.httpCommunicator.delete("/auth/user/session");
  }

  async refresh() {
    const { authToken } = await this.httpCommunicator.put<{
      authToken: string;
    }>("/auth/user/session");

    return authToken;
  }

  async getUser() {
    const user = await this.httpCommunicator.get<
      UserData & { permissions: PermissionName[]; roles: Role[] }
    >("/auth/user");

    return user;
  }

  async updateUser(user: Partial<Omit<UserData, "id">>, password?: string) {
    const payload: Record<string, string | number> = {
      ...user,
    };

    if (password) {
      payload.password = password;
    }

    await this.httpCommunicator.patch("/auth/user", payload);
  }
}
