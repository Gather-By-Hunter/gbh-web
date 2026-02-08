import type { Product } from "@model/index.ts";
import { ModelRepo } from "./ModelRepo.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";

export class ProductRepo extends ModelRepo<Product> {
  constructor(httpCommunicator: HttpCommunicator) {
    super(httpCommunicator, "rental/product");
  }
}
