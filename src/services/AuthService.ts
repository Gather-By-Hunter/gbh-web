import type { UserData, IdLess } from "@model/index.ts";
import type { AuthRepo } from "@repos/index.ts";
import type { PersistanceStore } from "@stores/PersistanceStore.ts";

export class AuthService {
  constructor(
    private persistanceStore: PersistanceStore,
    private repo: AuthRepo,
  ) {}

  async register(user: IdLess<UserData>, password: string): Promise<void> {
    await this.repo.register(user, password);
  }

  async login(email: string, password: string): Promise<void> {
    await this.repo.login(email, password);
  }

  async logout() {
    await this.repo.logout();

    this.persistanceStore.clearUser();
  }

  async refresh(): Promise<void> {
    await this.repo.refresh();
  }

  async getUser() {
    const user = await this.repo.getUser();

    return user;
  }

  async updateUser(user: Partial<IdLess<UserData>>, password?: string) {
    await this.repo.updateUser(user, password);
  }
}
