import { MediaMetadata, ModelType, RentalModel } from "@model/index.ts";
import type { Id } from "@model/Id.ts";
import type { Services } from "@services/Services.ts";
import type { UploadMediaRequest } from "@model/index.ts";
import type { AdminView } from "@presenters/AdminPresenter.ts";
import { AdminModelCache } from "./AdminModelCache.ts";
import { AdminModelServices } from "./AdminModelServices.ts";

interface ServiceWithMedia {
  getMedia: (modelId: Id) => AsyncIterableIterator<Id[]>;
}

const isServiceWithMedia = (service: object): service is ServiceWithMedia =>
  "getMedia" in service;

export class AdminMediaCoordinator {
  constructor(
    private readonly services: Services,
    private readonly view: AdminView,
    private readonly cache: AdminModelCache,
    private readonly modelServices: AdminModelServices,
  ) {}

  async fetchAndSetMedia(type: ModelType, modelId: Id): Promise<void> {
    const service = this.modelServices.getService(type);
    if (isServiceWithMedia(service)) {
      const mediaIds: Id[] = [];
      for await (const page of service.getMedia(modelId)) {
        mediaIds.push(...page);
      }

      if (mediaIds.length > 0) {
        await this.loadModelMedia(type, modelId, mediaIds);
        for (const mediaId of mediaIds) {
          await this.fetchVersions(mediaId);
        }
      } else {
        this.view.setModelMedia(type, modelId, []);
      }
    } else if (type === ModelType.MEDIA) {
      await this.fetchVersions(modelId);
    }
  }

  async loadModelMedia(
    type: ModelType,
    modelId: Id,
    mediaIds: Id[],
  ): Promise<void> {
    const mediaItems: MediaMetadata[] = [];

    for (const mediaId of mediaIds) {
      const cachedMedia = this.cache.getMedia(mediaId);
      if (cachedMedia) {
        mediaItems.push(cachedMedia);
        continue;
      }

      try {
        const media = await this.services.mediaService.get(mediaId);
        media.type = ModelType.MEDIA;
        this.cache.set(ModelType.MEDIA, media);
        mediaItems.push(media);
      } catch {
        // Keep loading remaining media if one association is stale.
      }
    }

    this.view.setModelMedia(type, modelId, mediaItems);
  }

  async fetchVersions(mediaId: Id): Promise<void> {
    const versions = await this.services.mediaService.getMediaVersions(mediaId);
    this.view.setMediaVersions(mediaId, versions);
  }

  async uploadMedia(request: UploadMediaRequest): Promise<MediaMetadata> {
    const media = await this.services.mediaService.uploadMedia(request);
    media.type = ModelType.MEDIA;
    this.cache.set(ModelType.MEDIA, media);
    this.view.addModelToList(ModelType.MEDIA, media);
    await this.fetchVersions(media.id);
    return media;
  }

  async refreshAssociatedMedia(
    modelType: ModelType,
    model: RentalModel,
  ): Promise<void> {
    await this.fetchAndSetMedia(modelType, model.id);
  }
}
