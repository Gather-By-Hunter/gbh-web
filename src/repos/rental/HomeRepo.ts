import { HttpCommunicator } from "@api/HttpCommunicator.ts";
import { HomeMedia, Id } from "@model/index.ts";
import type { ModelRepository } from "./ModelRepoHelper.ts";
import { ModelType } from "@model/index.ts";
import type { IdLess } from "@model/Id.ts";

export interface CreateHomeMediaRequest {
  mediaMetadataId: Id;
  displayOrder?: number;
}

export class HomeRepo implements ModelRepository<HomeMedia> {
  private readonly endpoint = "home";

  constructor(private httpCommunicator: HttpCommunicator) {}

  async create(model: IdLess<HomeMedia>): Promise<{ id: Id }>;
  async create(model: CreateHomeMediaRequest): Promise<{ id: Id }>;
  async create(
    model: IdLess<HomeMedia> | CreateHomeMediaRequest,
  ): Promise<{ id: Id }> {
    return this.httpCommunicator.post<{ id: Id }>(this.endpoint, model);
  }

  async get(modelId: Id): Promise<HomeMedia> {
    return this.httpCommunicator.get<HomeMedia>(`${this.endpoint}/${modelId}`);
  }

  async update(
    model: Partial<HomeMedia> & Pick<HomeMedia, "id">,
  ): Promise<void> {
    await this.httpCommunicator.patch(`${this.endpoint}/${model.id}`, model);
  }

  async *getAll(): AsyncIterableIterator<HomeMedia[]> {
    yield await this.httpCommunicator.get<HomeMedia[]>(this.endpoint);
  }

  async delete(modelId: Id): Promise<void> {
    await this.httpCommunicator.delete(`${this.endpoint}/${modelId}`);
  }

  async *getModels(): AsyncIterableIterator<HomeMedia[]> {
    yield* this.getAll();
  }

  async createAssociation(
    _modelId: Id,
    _associationId: Id,
    _association: ModelType,
  ): Promise<void> {
    // Associations not applicable for HomeMedia
  }

  async *getAssociations(
    _modelId: Id,
    _association: ModelType,
  ): AsyncIterableIterator<Id[]> {
    // Associations not applicable for HomeMedia
  }

  async removeAssociation(
    _modelId: Id,
    _associationId: Id,
    _association: ModelType,
  ): Promise<void> {
    // Associations not applicable for HomeMedia
  }

  async reorderHomeMedias(ids: Id[]): Promise<void> {
    return this.httpCommunicator.put(`${this.endpoint}/order`, { ids });
  }
}
