import type { Product } from "@model/index.ts";
import { ModelType } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import type { Id } from "@model/Id.ts";
import type { ProductRepo } from "@repos/rental/ProductRepo.ts";

export class ProductService extends ModelService<Product, ProductRepo> {
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
