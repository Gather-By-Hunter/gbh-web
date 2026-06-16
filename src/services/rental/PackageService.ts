import { Package, ModelType } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import { Id } from "@model/Id.ts";
import { PackageRepo } from "@repos/rental/PackageRepo.ts";

export class PackageService extends ModelService<Package, PackageRepo> {
  async getPackageProducts(modelId: Id) {
    return this.repo.getPackageProducts(modelId);
  }

  async setPackageProductQuantity(
    modelId: Id,
    productId: Id,
    quantity: number,
  ) {
    return this.repo.setPackageProductQuantity(modelId, productId, quantity);
  }

  async deletePackageProduct(modelId: Id, productId: Id) {
    return this.repo.removePackageProduct(modelId, productId);
  }

  async addMedia(modelId: Id, imageId: Id) {
    return this.createAssociation(modelId, imageId, ModelType.MEDIA);
  }

  async *getMedia(modelId: Id) {
    yield* this.getAssociations(modelId, ModelType.MEDIA);
  }

  async deleteMedia(modelId: Id, imageId: Id) {
    return this.removeAssociation(modelId, imageId, ModelType.MEDIA);
  }
}
