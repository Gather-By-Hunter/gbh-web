import type { Collection } from "@model/index.ts";
import { ModelRepo } from "./ModelRepo.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";

export class CollectionRepo extends ModelRepo<Collection> {
  constructor(httpCommunicator: HttpCommunicator) {
    super(httpCommunicator, "rental/collection");
  }
}
