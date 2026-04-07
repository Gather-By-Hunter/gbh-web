import { EventType } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import { Id } from "@model/Id.ts";
import { EventTypeRepo } from "@repos/index.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";

export class EventTypeService extends ModelService<EventType, EventTypeRepo> {
  async addCollection(modelId: Id, collectionId: Id) {
    return this.createAssociation(modelId, collectionId, ModelType.COLLECTION);
  }

  async *getCollections(modelId: Id) {
    yield* this.getAssociations(modelId, ModelType.COLLECTION);
  }

  async removeCollection(modelId: Id, collectionId: Id) {
    return this.removeAssociation(modelId, collectionId, ModelType.COLLECTION);
  }

  async addCategory(modelId: Id, categoryId: Id) {
    return this.createAssociation(modelId, categoryId, ModelType.CATEGORY);
  }

  async *getCategories(modelId: Id) {
    yield* this.getAssociations(modelId, ModelType.CATEGORY);
  }

  async deleteCategory(modelId: Id, categoryId: Id) {
    return this.removeAssociation(modelId, categoryId, ModelType.CATEGORY);
  }

  async addPackage(modelId: Id, packageId: Id) {
    return this.createAssociation(modelId, packageId, ModelType.PACKAGE);
  }

  async *getPackages(modelId: Id) {
    yield* this.getAssociations(modelId, ModelType.PACKAGE);
  }

  async deletePackage(modelId: Id, packageId: Id) {
    return this.removeAssociation(modelId, packageId, ModelType.PACKAGE);
  }

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
