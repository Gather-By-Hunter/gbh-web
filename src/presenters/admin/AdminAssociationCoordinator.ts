import { ModelType, RentalModel } from "@model/index.ts";
import type { Id } from "@model/Id.ts";
import type { AdminView } from "@presenters/AdminPresenter.ts";
import { AdminModelCache } from "./AdminModelCache.ts";
import { AdminModelServices } from "./AdminModelServices.ts";
import { AdminMediaCoordinator } from "./AdminMediaCoordinator.ts";

export class AdminAssociationCoordinator {
  constructor(
    private readonly view: AdminView,
    private readonly cache: AdminModelCache,
    private readonly modelServices: AdminModelServices,
    private readonly mediaCoordinator: AdminMediaCoordinator,
  ) {}

  async loadAssociations(
    modelId: Id,
    modelType: ModelType,
    associationType: ModelType,
  ): Promise<void> {
    if (modelType === ModelType.HOME_MEDIA) return;

    const service = this.modelServices.getService(modelType);
    const associationIds: Id[] = [];
    for await (const page of service.getAssociations(
      modelId,
      associationType,
    )) {
      associationIds.push(...page);
    }

    const associatedModels: RentalModel[] = [];
    for (const id of associationIds) {
      const cachedModel = this.cache.get(associationType, id);
      if (cachedModel) {
        associatedModels.push(cachedModel);
        continue;
      }

      const assocService = this.modelServices.getService(associationType);
      const model = await assocService.get(id);
      model.type = associationType;
      this.cache.set(associationType, model);
      associatedModels.push(model);
    }

    this.view.updateAssociatedModels(associationType, associatedModels);
  }

  async addAssociation(
    modelId: Id,
    modelType: ModelType,
    associationId: Id,
    associationType: ModelType,
  ): Promise<void> {
    const service = this.modelServices.getService(modelType);
    await service.createAssociation(modelId, associationId, associationType);
    await this.loadAssociations(modelId, modelType, associationType);

    if (associationType === ModelType.MEDIA) {
      await this.mediaCoordinator.fetchAndSetMedia(modelType, modelId);
    }
  }

  async removeAssociation(
    modelId: Id,
    modelType: ModelType,
    associationId: Id,
    associationType: ModelType,
  ): Promise<void> {
    const service = this.modelServices.getService(modelType);
    await service.removeAssociation(modelId, associationId, associationType);
    await this.loadAssociations(modelId, modelType, associationType);

    if (associationType === ModelType.MEDIA) {
      await this.mediaCoordinator.fetchAndSetMedia(modelType, modelId);
    }
  }
}
