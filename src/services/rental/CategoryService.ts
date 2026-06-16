import { Category, ModelType } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import { Id } from "@model/Id.ts";
import { CategoryRepo } from "@repos/rental/CategoryRepo.ts";

export class CategoryService extends ModelService<Category, CategoryRepo> {
  async addSubcategory(categoryId: Id, subcategoryId: Id) {
    return this.repo.addSubcategory(categoryId, subcategoryId);
  }

  async removeSubcategory(categoryId: Id, subcategoryId: Id) {
    return this.repo.removeSubcategory(categoryId, subcategoryId);
  }

  async *getSubcategories(categoryId: Id): AsyncIterableIterator<Category[]> {
    yield* this.repo.getSubcategories(categoryId);
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
