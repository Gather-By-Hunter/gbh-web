import type { Collection, Id } from "@model/index.ts";
import { ModelRepoHelper, type ModelRepository } from "./ModelRepoHelper.ts";
import { ModelType } from "@model/index.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";
import type { IdLess } from "@model/Id.ts";

export class CollectionRepo implements ModelRepository<Collection> {
  private readonly modelRepo: ModelRepoHelper<Collection>;

  constructor(httpCommunicator: HttpCommunicator) {
    this.modelRepo = new ModelRepoHelper(
      httpCommunicator,
      "rental",
      ModelType.COLLECTION,
    );
  }

  async create(model: IdLess<Collection>): Promise<{ id: Id }> {
    return this.modelRepo.create(model);
  }

  async get(modelId: Id): Promise<Collection> {
    return this.modelRepo.get(modelId);
  }

  async update(
    model: Partial<Collection> & Pick<Collection, "id">,
  ): Promise<void> {
    await this.modelRepo.update(model);
  }

  async *getAll(): AsyncIterableIterator<Collection[]> {
    yield* this.modelRepo.getAll();
  }

  async delete(modelId: Id): Promise<void> {
    await this.modelRepo.delete(modelId);
  }

  async *getModels(): AsyncIterableIterator<Collection[]> {
    yield* this.modelRepo.getModels();
  }

  async createAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ): Promise<void> {
    await this.modelRepo.createAssociation(
      modelId,
      associationId,
      association,
    );
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
    await this.modelRepo.removeAssociation(
      modelId,
      associationId,
      association,
    );
  }
}
