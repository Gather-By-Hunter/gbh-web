import { User, UserJson } from "@model/index.ts";
import { Store } from "./Store.ts";

export class PersistanceStore extends Store {
  constructor() {
    super();
  }

  getUser(): User | null {
    const userString = localStorage.getItem("user");

    if (!userString) {
      return null;
    }

    try {
      const user: UserJson = JSON.parse(userString);
      return new User(user, user.roles);
    } catch {
      return null;
    }
  }

  setUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user.toJson()));
    this.notify();
  }

  clearUser() {
    localStorage.removeItem("user");
    this.notify();
  }
}
