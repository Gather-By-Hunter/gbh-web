import { HttpCommunicator } from "@api/HttpCommunicator.ts";
import { Id, MediaMetadata, UploadPart, MediaVersion } from "@model/index.ts";
import { ModelRepoHelper, type ModelRepository } from "./ModelRepoHelper.ts";
import { ModelType } from "@model/index.ts";
import type { IdLess } from "@model/Id.ts";

export interface InitiateUploadRequest {
  name: string;
  title: string;
  description: string;
  size: number;
}

export interface InitiateUploadResponse {
  uploadTaskId: Id;
  urls: string[];
  uploadId: string;
}

export class MediaRepo implements ModelRepository<MediaMetadata> {
  private readonly modelRepo: ModelRepoHelper<MediaMetadata>;

  constructor(private httpCommunicator: HttpCommunicator) {
    this.modelRepo = new ModelRepoHelper(httpCommunicator, "rental", ModelType.MEDIA);
  }

  async create(model: IdLess<MediaMetadata>): Promise<{ id: Id }> {
    return this.modelRepo.create(model);
  }

  async get(modelId: Id): Promise<MediaMetadata> {
    return this.modelRepo.get(modelId);
  }

  async update(model: Partial<MediaMetadata> & Pick<MediaMetadata, "id">): Promise<void> {
    await this.modelRepo.update(model);
  }

  async *getAll(): AsyncIterableIterator<MediaMetadata[]> {
    yield* this.modelRepo.getAll();
  }

  async delete(modelId: Id): Promise<void> {
    await this.modelRepo.delete(modelId);
  }

  async *getModels(): AsyncIterableIterator<MediaMetadata[]> {
    yield* this.modelRepo.getModels();
  }

  async createAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ): Promise<void> {
    await this.modelRepo.createAssociation(modelId, associationId, association);
  }

  async *getAssociations(
    modelId: Id,
    association: ModelType,
  ): AsyncIterableIterator<Id[]> {
    yield* this.modelRepo.getAssociations(modelId, association);
  }

  async removeAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ): Promise<void> {
    await this.modelRepo.removeAssociation(modelId, associationId, association);
  }

  async getUploadIntent(
    request: InitiateUploadRequest,
  ): Promise<InitiateUploadResponse> {
    return this.httpCommunicator.post<InitiateUploadResponse>(
      `${this.modelRepo.singularEndpoint}/initiate-upload`,
      request,
    );
  }

  async finalizeUpload(
    uploadTaskId: Id,
    parts: UploadPart[],
  ): Promise<{ id: Id }> {
    return this.httpCommunicator.post<{ id: Id }>(
      `${this.modelRepo.singularEndpoint}/upload-task/${uploadTaskId}/finalize`,
      { parts },
    );
  }

  async getMediaVersions(mediaId: Id): Promise<MediaVersion[]> {
    return this.httpCommunicator.get<MediaVersion[]>(
      `${this.modelRepo.singularEndpoint}/${mediaId}/versions`,
    );
  }
}
