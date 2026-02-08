import type { Collection } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import type { Id } from "@model/Id.ts";
import type { CollectionRepo } from "@repos/index.ts";
import { Associations } from "@repos/rental/ModelRepo.ts";

export class CollectionService extends ModelService<
  Collection,
  CollectionRepo
> {
  async addCategory(modelId: Id, categoryId: Id) {
    return this.createAssociation(modelId, categoryId, Associations.CATEGORY);
  }

  async *getCategories(modelId: Id) {
    yield* this.getAssociations(modelId, Associations.CATEGORY);
  }

  async deleteCategory(modelId: Id, categoryId: Id) {
    return this.removeAssociation(modelId, categoryId, Associations.CATEGORY);
  }

  async addPackage(modelId: Id, packageId: Id) {
    return this.createAssociation(modelId, packageId, Associations.PACKAGE);
  }

  async *getPackages(modelId: Id) {
    yield* this.getAssociations(modelId, Associations.PACKAGE);
  }

  async deletePackage(modelId: Id, packageId: Id) {
    return this.removeAssociation(modelId, packageId, Associations.PACKAGE);
  }

  async addProduct(modelId: Id, productId: Id) {
    return this.createAssociation(modelId, productId, Associations.PRODUCT);
  }

  async *getProducts(modelId: Id) {
    yield* this.getAssociations(modelId, Associations.PRODUCT);
  }

  async deleteProduct(modelId: Id, productId: Id) {
    return this.removeAssociation(modelId, productId, Associations.PRODUCT);
  }

  async addImage(modelId: Id, imageId: Id) {
    return this.createAssociation(modelId, imageId, Associations.IMAGE);
  }

  async *getImages(modelId: Id) {
    yield* this.getAssociations(modelId, Associations.IMAGE);
  }

  async deleteImage(modelId: Id, imageId: Id) {
    return this.removeAssociation(modelId, imageId, Associations.IMAGE);
  }
}
