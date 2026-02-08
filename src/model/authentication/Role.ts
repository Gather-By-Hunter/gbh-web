import type { Id } from "@model/Id.ts";
import type { PermissionName } from "./Permission.ts";

export interface Role {
  id: Id;
  name: string;
  permissions: PermissionName[];
}
