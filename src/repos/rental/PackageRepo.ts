import type { Id, IdLess, Package, PackageProduct } from "@model/index.ts";
import { ModelRepoHelper, type ModelRepository } from "./ModelRepoHelper.ts";
import { ModelType } from "@model/index.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";

export class PackageRepo implements ModelRepository<Package> {
  private readonly modelRepo: ModelRepoHelper<Package>;

  constructor(private readonly httpCommunicator: HttpCommunicator) {
    this.modelRepo = new ModelRepoHelper(
      httpCommunicator,
      "rental",
      ModelType.PACKAGE,
    );
  }

  async create(model: IdLess<Package>): Promise<{ id: Id }> {
    return this.modelRepo.create(model);
  }

  async get(modelId: Id): Promise<Package> {
    return this.modelRepo.get(modelId);
  }

  async update(model: Partial<Package> & Pick<Package, "id">): Promise<void> {
    await this.modelRepo.update(model);
  }

  async *getAll(): AsyncIterableIterator<Package[]> {
    yield* this.modelRepo.getAll();
  }

  async delete(modelId: Id): Promise<void> {
    await this.modelRepo.delete(modelId);
  }

  async *getModels(): AsyncIterableIterator<Package[]> {
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

  async addMedia(packageId: Id, mediaId: Id) {
    return this.modelRepo.createAssociation(packageId, mediaId, ModelType.MEDIA);
  }

  async removeMedia(packageId: Id, mediaId: Id) {
    return this.modelRepo.removeAssociation(packageId, mediaId, ModelType.MEDIA);
  }

  async getPackageProducts(packageId: Id): Promise<PackageProduct[]> {
    return this.httpCommunicator.get<PackageProduct[]>(
      `rental/package/${packageId}/package-products`,
    );
  }

  async setPackageProductQuantity(
    packageId: Id,
    productId: Id,
    quantity: number,
  ): Promise<{ id: Id }> {
    return this.httpCommunicator.put<{ id: Id }>(
      `rental/package/${packageId}/package-product/${productId}`,
      { quantity },
    );
  }

  async removePackageProduct(packageId: Id, productId: Id): Promise<void> {
    await this.httpCommunicator.delete(
      `rental/package/${packageId}/package-product/${productId}`,
    );
  }

  async *getPackageMediaMetadata(packageId: Id) {
    yield* this.modelRepo.getAssociations(packageId, ModelType.MEDIA);
  }
}
