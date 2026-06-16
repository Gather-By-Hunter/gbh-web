import { HomeRepo } from "@repos/rental/HomeRepo.ts";
import { Id } from "@model/Id.ts";
import {
  HomeMediaDisplay,
  MediaVersion,
  ModelType,
} from "@model/index.ts";
import type { MediaService } from "./MediaService.ts";

export interface HomeMediaDisplayResult {
  photos: HomeMediaDisplay[];
  versions: Record<Id, MediaVersion[]>;
}

export class HomeService {
  constructor(
    private repo: HomeRepo,
    private mediaService: MediaService,
  ) {}

  async getHomeMedia() {
    const results = [];
    for await (const page of this.repo.getAll()) {
      results.push(...page);
    }
    return results;
  }

  async addMediaToHome(mediaMetadataId: Id, order?: number) {
    const { id } = await this.repo.create(
      order === undefined
        ? { mediaMetadataId }
        : {
            mediaMetadataId,
            displayOrder: order,
          },
    );
    return id;
  }

  async reorderHomeMedia(ids: Id[]) {
    return this.repo.reorderHomeMedias(ids);
  }

  async removeMediaFromHome(homeMediaId: Id) {
    return this.repo.delete(homeMediaId);
  }

  async getHomeMediaDisplays(): Promise<HomeMediaDisplayResult> {
    const homeMedia = await this.getHomeMedia();
    const photos: HomeMediaDisplay[] = [];
    const versions: Record<Id, MediaVersion[]> = {};

    for (const item of homeMedia) {
      const metadata = await this.mediaService.get(item.mediaMetadataId);
      if (!metadata) continue;

      photos.push({
        ...metadata,
        ...item,
        media: metadata,
        type: ModelType.HOME_MEDIA,
        name: metadata.name,
        description: metadata.description || `Display Order: ${item.displayOrder}`,
      });

      versions[item.mediaMetadataId] =
        await this.mediaService.getMediaVersions(item.mediaMetadataId);
    }

    return { photos, versions };
  }
}
