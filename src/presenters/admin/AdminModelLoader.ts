import { ModelType, RentalModel } from "@model/index.ts";
import type { AdminView } from "@presenters/AdminPresenter.ts";
import { adminModelTabs } from "./adminModelConfig.ts";
import { AdminHomeMediaCoordinator } from "./AdminHomeMediaCoordinator.ts";
import { AdminMediaCoordinator } from "./AdminMediaCoordinator.ts";
import { AdminModelCache } from "./AdminModelCache.ts";
import { AdminModelServices } from "./AdminModelServices.ts";

export class AdminModelLoader {
  constructor(
    private readonly view: AdminView,
    private readonly cache: AdminModelCache,
    private readonly modelServices: AdminModelServices,
    private readonly mediaCoordinator: AdminMediaCoordinator,
    private readonly homeMediaCoordinator: AdminHomeMediaCoordinator,
  ) {}

  async loadAllModels(): Promise<void> {
    for (const tab of adminModelTabs) {
      const type = tab.type;

      if (type === ModelType.HOME_MEDIA) {
        await this.homeMediaCoordinator.loadHomeMedia();
        continue;
      }

      const service = this.modelServices.getService(type);
      const models: RentalModel[] = [];
      for await (const page of service.getAll()) {
        page.forEach((model) => {
          model.type = type;
        });
        models.push(...page);
      }

      this.cache.setMany(type, models);
      this.view.setAllModels(type, models);

      for (const model of models) {
        await this.mediaCoordinator.fetchAndSetMedia(type, model.id);
      }
    }
  }
}
