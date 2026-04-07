import { Package } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import { Id } from "@model/Id.ts";
import { PackageRepo } from "@repos/rental/PackageRepo.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";

export class PackageService extends ModelService<Package, PackageRepo> {
  async addProduct(modelId: Id, productId: Id) {
    return this.createAssociation(modelId, productId, ModelType.PRODUCT);
  }

  async *getProducts(modelId: Id) {
    yield* this.getAssociations(modelId, ModelType.PRODUCT);
  }

  async deleteProduct(modelId: Id, productId: Id) {
    return this.removeAssociation(modelId, productId, ModelType.PRODUCT);
  }

  async addImage(modelId: Id, imageId: Id) {
    return this.createAssociation(modelId, imageId, ModelType.IMAGE);
  }

  async *getImages(modelId: Id) {
    yield* this.getAssociations(modelId, ModelType.IMAGE);
  }

  async deleteImage(modelId: Id, imageId: Id) {
    return this.removeAssociation(modelId, imageId, ModelType.IMAGE);
  }
}
