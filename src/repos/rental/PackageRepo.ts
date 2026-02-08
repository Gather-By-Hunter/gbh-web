import type { Package } from "@model/index.ts";
import { ModelRepo } from "./ModelRepo.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";

export class PackageRepo extends ModelRepo<Package> {
  constructor(httpCommunicator: HttpCommunicator) {
    super(httpCommunicator, "rental/package");
  }
}
