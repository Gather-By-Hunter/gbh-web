import type { Product } from "@model/index.ts";
import { ModelRepoHelper, type ModelRepository } from "./ModelRepoHelper.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";
import { ModelType } from "@model/index.ts";
import type { Id, IdLess } from "@model/Id.ts";

export class ProductRepo implements ModelRepository<Product> {
  private readonly modelRepo: ModelRepoHelper<Product>;

  constructor(httpCommunicator: HttpCommunicator) {
    this.modelRepo = new ModelRepoHelper(
      httpCommunicator,
      "rental",
      ModelType.PRODUCT,
    );
  }

  async create(model: IdLess<Product>) {
    return this.modelRepo.create(model);
  }

  async get(modelId: Id) {
    return this.modelRepo.get(modelId);
  }

  async update(model: Partial<Product> & Pick<Product, "id">) {
    await this.modelRepo.update(model);
  }

  async *getAll() {
    yield* this.modelRepo.getAll();
  }

  async delete(modelId: Id) {
    await this.modelRepo.delete(modelId);
  }

  async *getModels(): AsyncIterableIterator<Product[]> {
    yield* this.modelRepo.getModels();
  }

  async createAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    await this.modelRepo.createAssociation(modelId, associationId, association);
  }

  async *getAssociations(modelId: Id, association: ModelType) {
    yield* this.modelRepo.getAssociations(modelId, association);
  }

  async removeAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    await this.modelRepo.removeAssociation(modelId, associationId, association);
  }

  async addMedia(productId: Id, mediaMetadataId: Id) {
    await this.createAssociation(productId, mediaMetadataId, ModelType.MEDIA);
  }

  async removeMedia(productId: Id, mediaMetadataId: Id) {
    await this.removeAssociation(productId, mediaMetadataId, ModelType.MEDIA);
  }

  async *getProductMediaMetadata(
    productId: Id,
    _lastId: Id,
    _limit: number,
  ): AsyncIterableIterator<Id[]> {
    yield* this.getAssociations(productId, ModelType.MEDIA);
  }
}
