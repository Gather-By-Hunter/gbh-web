import { Services } from "@services/Services.ts";
import { Stores } from "@context/Context.ts";
import { PresenterView, ServicePresenter } from "./ServicePresenter.ts";

export interface HomeView extends PresenterView {}

export class HomePresenter extends ServicePresenter<HomeView> {
  constructor(
    private readonly services: Services,
    stores: Stores,
    view: HomeView,
  ) {
    super(services, stores, view);
  }

  async loadFeaturedPhotos(): Promise<void> {
    await this.doAsyncAction(async () => {
      this.stores.home.setLoading(true);

      const { photos, versions } =
        await this.services.homeService.getHomeMediaDisplays();
      this.stores.home.setFeaturedPhotos(photos, versions);
    });
  }
}
