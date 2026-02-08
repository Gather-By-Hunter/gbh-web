import { Category } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import { Id } from "@model/Id.ts";
import { CategoryRepo } from "@repos/rental/CategoryRepo.ts";
import { Associations } from "@repos/rental/ModelRepo.ts";

export class CategoryService extends ModelService<Category, CategoryRepo> {
  async addSubcategory(categoryId: Id, subcategoryId: Id) {
    return this.repo.addSubcategory(categoryId, subcategoryId);
  }

  async removeSubcategory(categoryId: Id, subcategoryId: Id) {
    return this.repo.removeSubcategory(categoryId, subcategoryId);
  }

  async *getSubcategories(categoryId: Id): AsyncIterableIterator<Category[]> {
    return this.repo.getSubcategories(categoryId);
  }

  async addPackage(modelId: Id, packageId: Id) {
    return this.createAssociation(modelId, packageId, Associations.PACKAGE);
  }

  async getPackages(modelId: Id) {
    return this.getAssociations(modelId, Associations.PACKAGE);
  }

  async deletePackage(modelId: Id, packageId: Id) {
    return this.removeAssociation(modelId, packageId, Associations.PACKAGE);
  }

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
