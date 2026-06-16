import { RentalModel, ModelType } from "@model/index.ts";
import { Id } from "@model/Id.ts";
import type {
  CreateModel,
  ModelRepository,
} from "@repos/rental/ModelRepoHelper.ts";

export class ModelService<T extends RentalModel, R extends ModelRepository<T>> {
  constructor(protected repo: R) {}

  async create(model: CreateModel<T>) {
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

  async createAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    return this.repo.createAssociation(modelId, associationId, association);
  }

  async *getAssociations(modelId: Id, association: ModelType) {
    yield* this.repo.getAssociations(modelId, association);
  }

  async removeAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    return this.repo.removeAssociation(modelId, associationId, association);
  }
}
