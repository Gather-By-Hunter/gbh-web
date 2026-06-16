import type {
  MediaMetadata,
  MediaVersion,
  PackageProductDisplay,
  Product,
  RentalModel,
  RentalModelUnion,
} from "@model/index.ts";
import { ModelType } from "@model/index.ts";
import type { Id } from "@model/Id.ts";
import type { Services } from "@services/Services.ts";
import type { UploadMediaRequest } from "@model/index.ts";
import type { Stores } from "@context/Context.ts";
import { PresenterView, ServicePresenter } from "./ServicePresenter.ts";
import {
  AdminAssociationCoordinator,
  AdminHomeMediaCoordinator,
  AdminMediaCoordinator,
  AdminModelCache,
  AdminModelLoader,
  AdminModelServices,
  AdminSearchCoordinator,
  createAdminCreatePresenter,
  getAdminModelAssociationTypes,
  getAdminModelSingularName,
  getAdminModelPluralName,
  type CreatePresenter,
} from "./admin/index.ts";

export interface AdminView extends PresenterView {
  setModelMedia: (type: ModelType, modelId: Id, media: MediaMetadata[]) => void;
  setMediaVersions: (mediaId: Id, versions: MediaVersion[]) => void;
  setAllModels: (type: ModelType, models: RentalModel[]) => void;
  setSelectedModel: (model: RentalModelUnion | null) => void;
  updateModelInList: (type: ModelType, model: RentalModel) => void;
  removeModelFromList: (type: ModelType, modelId: Id) => void;
  addModelToList: (type: ModelType, model: RentalModel) => void;
  updateAssociatedModels: (type: ModelType, models: RentalModel[]) => void;
  setSearchResults: (type: ModelType, models: RentalModel[]) => void;
  setLoading: (loading: boolean) => void;
}

export class AdminPresenter extends ServicePresenter<AdminView> {
  private readonly cache: AdminModelCache;
  private readonly modelServices: AdminModelServices;
  private readonly mediaCoordinator: AdminMediaCoordinator;
  private readonly homeMediaCoordinator: AdminHomeMediaCoordinator;
  private readonly associationCoordinator: AdminAssociationCoordinator;
  private readonly searchCoordinator: AdminSearchCoordinator;
  private readonly modelLoader: AdminModelLoader;

  constructor(
    private readonly services: Services,
    stores: Stores,
    view: AdminView,
  ) {
    super(services, stores, view);
    this.cache = new AdminModelCache();
    this.modelServices = new AdminModelServices(services);
    this.mediaCoordinator = new AdminMediaCoordinator(
      services,
      view,
      this.cache,
      this.modelServices,
    );
    this.homeMediaCoordinator = new AdminHomeMediaCoordinator(
      services,
      view,
      this.cache,
    );
    this.associationCoordinator = new AdminAssociationCoordinator(
      view,
      this.cache,
      this.modelServices,
      this.mediaCoordinator,
    );
    this.searchCoordinator = new AdminSearchCoordinator(view, this.cache);
    this.modelLoader = new AdminModelLoader(
      view,
      this.cache,
      this.modelServices,
      this.mediaCoordinator,
      this.homeMediaCoordinator,
    );
  }

  async onMount(): Promise<void> {
    this.view.setLoading(true);
    await this.loadAllModels();
    this.view.setLoading(false);
  }

  async loadAllModels(): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.modelLoader.loadAllModels();
    });
  }

  async updateModel(type: ModelType, model: RentalModel): Promise<void> {
    await this.doAsyncAction(async () => {
      if (type === ModelType.HOME_MEDIA) {
        this.view.displayMessage("Home media updates not yet implemented");
        return;
      }

      const service = this.modelServices.getService(type);
      await service.update(model);
      const updatedModel = await service.get(model.id);
      updatedModel.type = type;
      this.cache.set(type, updatedModel);
      this.view.updateModelInList(type, updatedModel);
      this.view.displayMessage(
        `${getAdminModelSingularName(type)} updated successfully`,
      );
    });
  }

  async deleteModel(type: ModelType, modelId: Id): Promise<void> {
    await this.doAsyncAction(async () => {
      if (type === ModelType.HOME_MEDIA) {
        await this.homeMediaCoordinator.removeHomeMedia(modelId);
        this.view.displayMessage("Home media removed successfully");
        return;
      }

      const service = this.modelServices.getService(type);
      await service.delete(modelId);
      this.cache.delete(type, modelId);
      this.view.removeModelFromList(type, modelId);
      this.view.displayMessage(
        `${getAdminModelSingularName(type)} deleted successfully`,
      );
    });
  }

  async selectModel(type: ModelType, modelId: Id): Promise<void> {
    await this.doAsyncAction(async () => {
      if (type === ModelType.HOME_MEDIA) {
        await this.homeMediaCoordinator.selectHomeMedia(modelId);
        return;
      }

      const service = this.modelServices.getService(type);
      const model = await service.get(modelId);
      model.type = type;
      this.cache.set(type, model);
      this.view.setSelectedModel(model as RentalModelUnion);

      if (type === ModelType.MEDIA) {
        await this.mediaCoordinator.fetchVersions(modelId);
      }

      for (const associationType of getAdminModelAssociationTypes(type)) {
        await this.associationCoordinator.loadAssociations(
          modelId,
          type,
          associationType,
        );

        if (associationType === ModelType.MEDIA) {
          await this.mediaCoordinator.fetchAndSetMedia(type, modelId);
        }
      }
    });
  }

  async loadAssociations(
    modelId: Id,
    modelType: ModelType,
    associationType: ModelType,
  ): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.associationCoordinator.loadAssociations(
        modelId,
        modelType,
        associationType,
      );
    });
  }

  async addAssociation(
    modelId: Id,
    modelType: ModelType,
    associationId: Id,
    associationType: ModelType,
  ): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.associationCoordinator.addAssociation(
        modelId,
        modelType,
        associationId,
        associationType,
      );
      this.view.displayMessage("Association added successfully");
    });
  }

  async removeAssociation(
    modelId: Id,
    modelType: ModelType,
    associationId: Id,
    associationType: ModelType,
  ): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.associationCoordinator.removeAssociation(
        modelId,
        modelType,
        associationId,
        associationType,
      );
      this.view.displayMessage("Association removed successfully");
    });
  }

  async getPackageProducts(packageId: Id): Promise<PackageProductDisplay[]> {
    const packageProducts =
      await this.services.packageService.getPackageProducts(packageId);
    const displays: PackageProductDisplay[] = [];

    for (const packageProduct of packageProducts) {
      const cached = this.cache.get(
        ModelType.PRODUCT,
        packageProduct.productId,
      );
      const product =
        cached !== undefined
          ? (cached as Product)
          : await this.services.productService.get(packageProduct.productId);
      product.type = ModelType.PRODUCT;
      this.cache.set(ModelType.PRODUCT, product);
      displays.push({ ...packageProduct, product });
    }

    return displays;
  }

  async setPackageProductQuantity(
    packageId: Id,
    productId: Id,
    quantity: number,
  ): Promise<PackageProductDisplay[]> {
    await this.doAsyncAction(async () => {
      await this.services.packageService.setPackageProductQuantity(
        packageId,
        productId,
        quantity,
      );
      this.view.displayMessage("Package product saved successfully");
    });

    return this.getPackageProducts(packageId);
  }

  async removePackageProduct(
    packageId: Id,
    productId: Id,
  ): Promise<PackageProductDisplay[]> {
    await this.doAsyncAction(async () => {
      await this.services.packageService.deletePackageProduct(
        packageId,
        productId,
      );
      this.view.displayMessage("Package product removed successfully");
    });

    return this.getPackageProducts(packageId);
  }

  async searchModels(type: ModelType, query: string): Promise<void> {
    await this.doAsyncAction(async () => {
      this.searchCoordinator.searchModels(type, query);
    });
  }

  async uploadMedia(request: UploadMediaRequest): Promise<MediaMetadata> {
    try {
      const media = await this.mediaCoordinator.uploadMedia(request);
      this.view.displayMessage("Media uploaded successfully");
      return media;
    } catch (error) {
      this.handleError(error);
      if (error instanceof Error) throw error;
      throw new Error("Failed to upload media");
    }
  }

  async reorderHomeMedia(ids: Id[]): Promise<void> {
    await this.doAsyncAction(async () => {
      await this.homeMediaCoordinator.reorderHomeMedia(ids);
      this.view.displayMessage("Home media reordered successfully");
    });
  }

  createPresenterFor(type: ModelType): CreatePresenter | null {
    return createAdminCreatePresenter(type, this.services);
  }

  getAssociationTypesForModel(type: ModelType): ModelType[] {
    return getAdminModelAssociationTypes(type);
  }

  static getModelTypeDisplayName(type: ModelType): string {
    return getAdminModelPluralName(type);
  }

  static getSingularDisplayName(type: ModelType): string {
    return getAdminModelSingularName(type);
  }
}
