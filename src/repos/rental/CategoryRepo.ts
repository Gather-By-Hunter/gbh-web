import type { Category, Id } from "@model/index.ts";
import { ModelRepo } from "./ModelRepo.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";

export class CategoryRepo extends ModelRepo<Category> {
  constructor(httpCommunicator: HttpCommunicator) {
    super(httpCommunicator, "rental/category", "rental/categories");
  }

  async *getSubcategories(categoryId: Id) {
    yield* this.getPaginated<Category>(
      `${this.endpoint}/${categoryId}/subcategories`,
    );
  }

  async addSubcategory(categoryId: Id, subcategoryId: Id) {
    return this.httpCommunicator.put(
      `${this.endpoint}/${categoryId}/${subcategoryId}`,
    );
  }

  async removeSubcategory(categoryId: Id, subcategoryId: Id) {
    return this.httpCommunicator.delete(
      `${this.endpoint}/${categoryId}/${subcategoryId}`,
    );
  }
}
