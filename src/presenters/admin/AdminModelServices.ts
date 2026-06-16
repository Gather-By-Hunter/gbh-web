import { ModelType, RentalModel } from "@model/index.ts";
import type { ModelRepository } from "@repos/rental/ModelRepoHelper.ts";
import type { Services } from "@services/Services.ts";
import type { ModelService } from "@services/rental/ModelService.ts";

export class AdminModelServices {
  private readonly serviceMap: Partial<
    Record<ModelType, ModelService<RentalModel, ModelRepository<RentalModel>>>
  >;

  constructor(services: Services) {
    this.serviceMap = {
      [ModelType.EVENT_TYPE]: services.eventTypeService,
      [ModelType.COLLECTION]: services.collectionService,
      [ModelType.CATEGORY]: services.categoryService,
      [ModelType.PACKAGE]: services.packageService,
      [ModelType.PRODUCT]: services.productService,
      [ModelType.MEDIA]: services.mediaService,
    };
  }

  getService(
    type: ModelType,
  ): ModelService<RentalModel, ModelRepository<RentalModel>> {
    const service = this.serviceMap[type];
    if (!service) {
      throw new Error(`Unknown model type: ${type}`);
    }
    return service;
  }
}
