import type {
  MediaRepo,
  InitiateUploadRequest,
  InitiateUploadResponse,
} from "@repos/rental/MediaRepo.ts";
import {
  Id,
  MediaMetadata,
  UploadMediaRequest,
  UploadPart,
  MediaVersion,
} from "@model/index.ts";
import { ModelService } from "./ModelService.ts";

export class MediaService extends ModelService<MediaMetadata, MediaRepo> {
  constructor(repo: MediaRepo) {
    super(repo);
  }

  async initiateUpload(
    request: InitiateUploadRequest,
  ): Promise<InitiateUploadResponse> {
    return this.repo.getUploadIntent(request);
  }

  async finalizeUpload(uploadTaskId: Id, parts: UploadPart[]): Promise<Id> {
    const { id } = await this.repo.finalizeUpload(uploadTaskId, parts);
    return id;
  }

  async uploadMedia({
    file,
    name,
    title,
    description,
  }: UploadMediaRequest): Promise<MediaMetadata> {
    const { uploadTaskId, urls } = await this.initiateUpload({
      name,
      title,
      description,
      size: file.size,
    });
    const parts: UploadPart[] = [];
    const partSize = Math.ceil(file.size / urls.length);

    for (let i = 0; i < urls.length; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, file.size);
      const chunk = file.slice(start, end);
      const uploadUrl = urls[i]!;

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: chunk,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload of part ${i + 1} failed`);
      }

      const etag = uploadResponse.headers.get("ETag");
      if (!etag) {
        throw new Error(`Missing ETag for part ${i + 1}`);
      }

      parts.push({
        ETag: etag.replace(/"/g, ""),
        PartNumber: i + 1,
      });
    }

    const mediaId = await this.finalizeUpload(uploadTaskId, parts);
    return this.get(mediaId);
  }

  async getMediaVersions(mediaId: Id): Promise<MediaVersion[]> {
    return this.repo.getMediaVersions(mediaId);
  }
}
