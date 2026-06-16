import { HomeMediaDisplay, ModelType } from "@model/index.ts";
import type { Id } from "@model/Id.ts";
import type { Services } from "@services/Services.ts";
import type { AdminView } from "@presenters/AdminPresenter.ts";
import { AdminModelCache } from "./AdminModelCache.ts";

export class AdminHomeMediaCoordinator {
  constructor(
    private readonly services: Services,
    private readonly view: AdminView,
    private readonly cache: AdminModelCache,
  ) {}

  async loadHomeMedia(): Promise<void> {
    const { photos, versions } =
      await this.services.homeService.getHomeMediaDisplays();

    this.view.setAllModels(ModelType.HOME_MEDIA, photos);

    for (const photo of photos) {
      this.cache.set(ModelType.HOME_MEDIA, photo);
      if (photo.media) {
        this.cache.set(ModelType.MEDIA, photo.media);
      }
    }

    for (const [mediaId, mediaVersions] of Object.entries(versions)) {
      this.view.setMediaVersions(Number(mediaId), mediaVersions);
    }
  }

  async selectHomeMedia(homeMediaId: Id): Promise<void> {
    const cached = this.cache.get(ModelType.HOME_MEDIA, homeMediaId);
    if (cached) {
      this.view.setSelectedModel(cached as HomeMediaDisplay);
      return;
    }

    await this.loadHomeMedia();
    const refreshed = this.cache.get(ModelType.HOME_MEDIA, homeMediaId);
    if (refreshed) {
      this.view.setSelectedModel(refreshed as HomeMediaDisplay);
    }
  }

  async removeHomeMedia(homeMediaId: Id): Promise<void> {
    await this.services.homeService.removeMediaFromHome(homeMediaId);
    this.cache.delete(ModelType.HOME_MEDIA, homeMediaId);
    this.view.removeModelFromList(ModelType.HOME_MEDIA, homeMediaId);
  }

  async reorderHomeMedia(ids: Id[]): Promise<void> {
    await this.services.homeService.reorderHomeMedia(ids);
    await this.loadHomeMedia();
  }
}
