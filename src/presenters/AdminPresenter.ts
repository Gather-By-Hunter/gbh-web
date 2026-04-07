import type { RentalModel } from "@model/index.ts";
import { ServicePresenter, PresenterView } from "./ServicePresenter.ts";
import type { ModelService } from "@services/rental/ModelService.ts";
import { ModelRepo, ModelType } from "@repos/rental/ModelRepo.ts";
import { Id } from "@model/Id.ts";
import { Services } from "@services/Services.ts";
import { AdminCache } from "@context/react-context/AdminCacheContext.tsx";

const modelNameToDisplayName: Record<ModelType, string> = {
  [ModelType.EVENT_TYPE]: "Event Type",
  [ModelType.COLLECTION]: "Collection",
  [ModelType.CATEGORY]: "Category",
  [ModelType.PACKAGE]: "Package",
  [ModelType.PRODUCT]: "Product",
  [ModelType.IMAGE]: "Image",
};

export interface ModelDetail {
  model: RentalModel;
  associations: Partial<Record<ModelType, RentalModel[]>>;
}

export interface AdminView extends PresenterView {
  setModels: (models: RentalModel[]) => void;
  setSelectedModelDetail: (detail: ModelDetail | null) => void;
  updateAssociatedModels: (type: ModelType, models: RentalModel[]) => void;
  setSearchResults: (type: ModelType, models: RentalModel[]) => void;
  setLoading: (loading: boolean) => void;
}

export class AdminPresenter extends ServicePresenter<AdminView> {
  constructor(
    services: Services,
    view: AdminView,
    private cache: React.MutableRefObject<AdminCache>,
  ) {
    super(services, view);
  }

  private getCacheKey(type: ModelType, id: Id): string {
    return `${type}:${id}`;
  }

  async getModels(modelType: ModelType) {
    this.view.setLoading(true);
    await this.doAsyncAction(async () => {
      const service = this.getServiceForModel(modelType);
      const allModels: RentalModel[] = [];
      for await (const models of service.getAll()) {
        allModels.push(...models);
        // Cache these models as we get them
        models.forEach((m) =>
          this.cache.current.modelCache.set(this.getCacheKey(modelType, m.id), m),
        );
      }
      this.cache.current.allModelsCache.set(modelType, allModels);
      this.view.setModels(allModels);
    });
    this.view.setLoading(false);
  }

  async searchModels(modelType: ModelType, query: string) {
    await this.doAsyncAction(async () => {
      let allModels = this.cache.current.allModelsCache.get(modelType);

      if (!allModels) {
        const service = this.getServiceForModel(modelType);
        allModels = [];
        for await (const models of service.getAll()) {
          allModels.push(...models);
          models.forEach((m) =>
            this.cache.current.modelCache.set(this.getCacheKey(modelType, m.id), m),
          );
        }
        this.cache.current.allModelsCache.set(modelType, allModels);
      }

      const filtered = allModels.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase()),
      );

      this.view.setSearchResults(modelType, filtered);
    });
  }

  async getModelDetail(modelType: ModelType, id: Id) {
    this.view.setLoading(true);
    await this.doAsyncAction(async () => {
      const service = this.getServiceForModel(modelType);
      const model = await service.get(id);

      if (!model) {
        this.view.displayError("Model not found");
        return;
      }

      this.cache.current.modelCache.set(this.getCacheKey(modelType, id), model);

      const associations: Partial<Record<ModelType, RentalModel[]>> = {};
      const associationTypes = this.getAssociationTypesForModel(modelType);

      // Initialize associations with empty arrays
      for (const type of associationTypes) {
        associations[type] = [];
      }

      this.view.setSelectedModelDetail({ model, associations });

      // Fetch associations lazily
      for (const type of associationTypes) {
        // @ts-ignore
        const iterator = service[`get${this.getPluralName(type)}`](id);
        for await (const idChunk of iterator) {
          const fetchedModels: RentalModel[] = [];
          for (const assocId of idChunk) {
            const cacheKey = this.getCacheKey(type, assocId);
            if (this.cache.current.modelCache.has(cacheKey)) {
              fetchedModels.push(this.cache.current.modelCache.get(cacheKey)!);
            } else {
              try {
                const assocModel = await this.getServiceForModel(type).get(assocId);
                if (assocModel) {
                  this.cache.current.modelCache.set(cacheKey, assocModel);
                  fetchedModels.push(assocModel);
                }
              } catch (e) {
                console.error(`Failed to fetch ${type} with id ${assocId}`, e);
              }
            }
          }
          this.view.updateAssociatedModels(type, fetchedModels);
        }
      }
    });
    this.view.setLoading(false);
  }

  private getServiceForModel(
    modelType: ModelType,
  ): ModelService<RentalModel, ModelRepo<RentalModel>> {
    switch (modelType) {
      case ModelType.EVENT_TYPE:
        return this.eventTypeService;
      case ModelType.COLLECTION:
        return this.collectionService;
      case ModelType.CATEGORY:
        return this.categoryService;
      case ModelType.PACKAGE:
        return this.packageService;
      case ModelType.PRODUCT:
        return this.productService;
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }

  private getAssociationTypesForModel(modelType: ModelType): ModelType[] {
    switch (modelType) {
      case ModelType.EVENT_TYPE:
        return [
          ModelType.COLLECTION,
          ModelType.CATEGORY,
          ModelType.PACKAGE,
          ModelType.PRODUCT,
          ModelType.IMAGE,
        ];
      case ModelType.COLLECTION:
        return [
          ModelType.CATEGORY,
          ModelType.PACKAGE,
          ModelType.PRODUCT,
          ModelType.IMAGE,
        ];
      case ModelType.CATEGORY:
        return [
          ModelType.CATEGORY, // subcategories
          ModelType.PACKAGE,
          ModelType.PRODUCT,
          ModelType.IMAGE,
        ];
      case ModelType.PACKAGE:
        return [ModelType.PRODUCT, ModelType.IMAGE];
      case ModelType.PRODUCT:
        return [ModelType.IMAGE];
      default:
        return [];
    }
  }

  private getPluralName(type: ModelType): string {
    switch (type) {
      case ModelType.EVENT_TYPE:
        return "EventTypes";
      case ModelType.COLLECTION:
        return "Collections";
      case ModelType.CATEGORY:
        return "Categories";
      case ModelType.PACKAGE:
        return "Packages";
      case ModelType.PRODUCT:
        return "Products";
      case ModelType.IMAGE:
        return "Images";
      default:
        return "";
    }
  }
}
