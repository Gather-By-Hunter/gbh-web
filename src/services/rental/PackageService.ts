import { Package } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import { Id } from "@model/Id.ts";
import { PackageRepo } from "@repos/rental/PackageRepo.ts";
import { Associations } from "@repos/rental/ModelRepo.ts";

export class PackageService extends ModelService<Package, PackageRepo> {
  async addProduct(modelId: Id, productId: Id) {
    return this.createAssociation(modelId, productId, Associations.PRODUCT);
  }

  async getProducts(modelId: Id) {
    return this.getAssociations(modelId, Associations.PRODUCT);
  }

  async deleteProduct(modelId: Id, productId: Id) {
    return this.removeAssociation(modelId, productId, Associations.PRODUCT);
  }

  async addImage(modelId: Id, imageId: Id) {
    return this.createAssociation(modelId, imageId, Associations.IMAGE);
  }

  async getImages(modelId: Id) {
    return this.getAssociations(modelId, Associations.IMAGE);
  }

  async deleteImage(modelId: Id, imageId: Id) {
    return this.removeAssociation(modelId, imageId, Associations.IMAGE);
  }
}
