import type { Product } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import type { Id } from "@model/Id.ts";
import type { ProductRepo } from "@repos/rental/ProductRepo.ts";
import { Associations } from "@repos/rental/ModelRepo.ts";

export class ProductService extends ModelService<Product, ProductRepo> {
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
