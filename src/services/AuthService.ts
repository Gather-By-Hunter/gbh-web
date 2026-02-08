import type { UserData } from "@model/index.ts";
import type { AuthRepo } from "@repos/index.ts";
import type { PersistanceStore } from "@stores/PersistanceStore.ts";

export class AuthService {
  constructor(
    private persistanceStore: PersistanceStore,
    private repo: AuthRepo,
  ) {
    const authToken = this.persistanceStore.getAuthToken();

    if (!authToken) {
      return;
    }

    // try to refresh token on startup
    // if refresh fails (most likely token
    // has already expired) clear token
    this.refresh().catch(() => {
      this.persistanceStore.clearAuthToken();
    });
  }

  async register(user: Omit<UserData, "id">, password: string) {
    const authToken = await this.repo.register(user, password);

    this.persistanceStore.setAuthToken(authToken);
  }

  async login(email: string, password: string) {
    const authToken = await this.repo.login(email, password);

    this.persistanceStore.setAuthToken(authToken);
  }

  async logout() {
    await this.repo.logout();

    this.persistanceStore.clearAuthToken();
  }

  async refresh() {
    const authToken = await this.repo.refresh();

    this.persistanceStore.setAuthToken(authToken);
  }

  async getUser() {
    const user = await this.repo.getUser();

    return user;
  }

  async updateUser(user: Partial<Omit<UserData, "id">>, password?: string) {
    await this.repo.updateUser(user, password);
  }
}
