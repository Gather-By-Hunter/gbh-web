import { User } from "@model/index.ts";

type AuthTokenCallback = (authToken: string | null) => any;

export class PersistanceStore {
  private authTokenSubscriptions: Record<string, AuthTokenCallback> = {};

  subscribeToAuthToken(callback: AuthTokenCallback) {
    const id = crypto.randomUUID();

    this.authTokenSubscriptions[id] = callback;

    return id;
  }

  unsubscribeFromAuthToken(id: string) {
    if (!this.authTokenSubscriptions[id]) {
      return;
    }

    delete this.authTokenSubscriptions[id];
  }

  private callSubscriptions(authToken: string | null) {
    for (const id of Object.keys(this.authTokenSubscriptions)) {
      this.authTokenSubscriptions[id](authToken);
    }
  }

  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  setAuthToken(authToken: string) {
    localStorage.setItem("authToken", authToken);

    this.callSubscriptions(authToken);
  }

  clearAuthToken() {
    localStorage.removeItem("authToken");

    this.callSubscriptions(null);
  }

  getUser(): User | null {
    const userString = localStorage.getItem("user");

    if (!userString) {
      return null;
    }

    const user: ReturnType<User["toJson"]> = JSON.parse(userString);

    return new User(user, user.roles);
  }

  setUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user.toJson()));
  }

  clearUser() {
    localStorage.removeItem("user");
  }
}
