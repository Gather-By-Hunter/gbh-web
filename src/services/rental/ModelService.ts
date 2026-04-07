import { RentalModel } from "@model/index.ts";
import { Id } from "@model/Id.ts";
import type { ModelType, ModelRepo } from "@repos/rental/ModelRepo.ts";

export class ModelService<T extends RentalModel, R extends ModelRepo<T>> {
  constructor(protected repo: R) {}

  async create(model: Omit<T, "id">) {
    return this.repo.create(model);
  }

  async get(modelId: Id) {
    return this.repo.get(modelId);
  }

  async update(model: Partial<T> & Pick<T, "id">) {
    return this.repo.update(model);
  }

  async *getAll(): AsyncIterableIterator<T[]> {
    yield* this.repo.getAll();
  }

  async delete(modelId: Id) {
    return this.repo.delete(modelId);
  }

  protected async createAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    return this.repo.createAssociation(modelId, associationId, association);
  }

  protected async *getAssociations(modelId: Id, association: ModelType) {
    yield* this.repo.getAssociations(modelId, association);
  }

  protected async removeAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    return this.repo.removeAssociation(modelId, associationId, association);
  }
}
