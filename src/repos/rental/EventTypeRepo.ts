import type { EventType, Id } from "@model/index.ts";
import { ModelRepoHelper, type ModelRepository } from "./ModelRepoHelper.ts";
import { ModelType } from "@model/index.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";
import type { IdLess } from "@model/Id.ts";

export class EventTypeRepo implements ModelRepository<EventType> {
  private readonly modelRepo: ModelRepoHelper<EventType>;

  constructor(httpCommunicator: HttpCommunicator) {
    this.modelRepo = new ModelRepoHelper(
      httpCommunicator,
      "rental",
      ModelType.EVENT_TYPE,
    );
  }

  async create(model: IdLess<EventType>): Promise<{ id: Id }> {
    return this.modelRepo.create(model);
  }

  async get(modelId: Id): Promise<EventType> {
    return this.modelRepo.get(modelId);
  }

  async update(
    model: Partial<EventType> & Pick<EventType, "id">,
  ): Promise<void> {
    await this.modelRepo.update(model);
  }

  async *getAll(): AsyncIterableIterator<EventType[]> {
    yield* this.modelRepo.getAll();
  }

  async delete(modelId: Id): Promise<void> {
    await this.modelRepo.delete(modelId);
  }

  async *getModels(): AsyncIterableIterator<EventType[]> {
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
