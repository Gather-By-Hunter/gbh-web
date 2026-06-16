import type { Category, Id } from "@model/index.ts";
import { ModelRepoHelper, type ModelRepository } from "./ModelRepoHelper.ts";
import { ModelType } from "@model/index.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";
import type { IdLess } from "@model/Id.ts";

export class CategoryRepo implements ModelRepository<Category> {
  private readonly modelRepo: ModelRepoHelper<Category>;

  constructor(private readonly httpCommunicator: HttpCommunicator) {
    this.modelRepo = new ModelRepoHelper(
      httpCommunicator,
      "rental",
      ModelType.CATEGORY,
    );
  }

  async create(model: IdLess<Category>): Promise<{ id: Id }> {
    return this.modelRepo.create(model);
  }

  async get(modelId: Id): Promise<Category> {
    return this.modelRepo.get(modelId);
  }

  async update(model: Partial<Category> & Pick<Category, "id">): Promise<void> {
    await this.modelRepo.update(model);
  }

  async *getAll(): AsyncIterableIterator<Category[]> {
    yield* this.modelRepo.getAll();
  }

  async delete(modelId: Id): Promise<void> {
    await this.modelRepo.delete(modelId);
  }

  async *getModels(): AsyncIterableIterator<Category[]> {
    yield* this.modelRepo.getModels();
  }

  async createAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ): Promise<void> {
    await this.modelRepo.createAssociation(modelId, associationId, association);
  }

  async *getAssociations(
    modelId: Id,
    association: ModelType,
  ): AsyncIterableIterator<Id[]> {
    yield* this.modelRepo.getAssociations(modelId, association);
  }

  async removeAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ): Promise<void> {
    await this.modelRepo.removeAssociation(modelId, associationId, association);
  }

  async *getSubcategories(categoryId: Id) {
    yield* this.modelRepo.getPaginated<Category>(
      `${this.modelRepo.singularEndpoint}/${categoryId}/subcategories`,
    );
  }

  async addSubcategory(categoryId: Id, subcategoryId: Id) {
    return this.httpCommunicator.put(
      `${this.modelRepo.singularEndpoint}/${categoryId}/${subcategoryId}`,
    );
  }

  async removeSubcategory(categoryId: Id, subcategoryId: Id) {
    return this.httpCommunicator.delete(
      `${this.modelRepo.singularEndpoint}/${categoryId}/${subcategoryId}`,
    );
  }
}
