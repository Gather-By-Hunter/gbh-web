import type { HttpCommunicator } from "@api/HttpCommunicator.ts";
import type { Id } from "@model/Id.ts";
import { ModelType } from "@model/index.ts";
import { getAdminModelPluralEndpoint } from "@presenters/admin/adminModelConfig.ts";

export type CreateModel<T extends { id: Id }> = Omit<T, "id" | "type">;
export type UpdateModel<T extends { id: Id }> = Partial<Omit<T, "type">> &
  Pick<T, "id">;

export interface ModelRepository<T extends { id: Id }> {
  create(model: CreateModel<T>): Promise<{ id: Id }>;
  get(modelId: Id): Promise<T>;
  update(model: UpdateModel<T>): Promise<void>;
  getAll(): AsyncIterableIterator<T[]>;
  delete(modelId: Id): Promise<void>;
  getModels(): AsyncIterableIterator<T[]>;
  createAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ): Promise<void>;
  getAssociations(
    modelId: Id,
    association: ModelType,
  ): AsyncIterableIterator<Id[]>;
  removeAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ): Promise<void>;
}

export class ModelRepoHelper<T extends { id: Id }> {
  public readonly singularEndpoint: string;
  public readonly pluralEndpoint: string;

  constructor(
    private readonly httpCommunicator: HttpCommunicator,
    basePath: string,
    modelType: ModelType,
  ) {
    const pluralName = getAdminModelPluralEndpoint(modelType);
    const singularName: string = modelType;

    this.singularEndpoint = `${basePath}/${singularName}`;
    this.pluralEndpoint = `${basePath}/${pluralName}`;
  }

  async create(model: CreateModel<T>) {
    return this.httpCommunicator.post<{ id: Id }>(this.singularEndpoint, model);
  }

  async get(modelId: Id) {
    return this.httpCommunicator.get<T>(`${this.singularEndpoint}/${modelId}`);
  }

  async update(model: Partial<T> & Pick<T, "id">) {
    const request = stripModelType(model);
    return this.httpCommunicator.put(`${this.singularEndpoint}/${model.id}`, request);
  }

  async *getAll() {
    yield* this.getPaginated<T>(this.pluralEndpoint);
  }

  async delete(modelId: Id) {
    return this.httpCommunicator.delete(`${this.singularEndpoint}/${modelId}`);
  }

  async *getModels(): AsyncIterableIterator<T[]> {
    yield* this.getPaginated<T>(this.pluralEndpoint);
  }

  async createAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    return this.httpCommunicator.put(
      `${this.singularEndpoint}/${modelId}/${association}/${associationId}`,
    );
  }

  async *getAssociations(
    modelId: Id,
    association: ModelType,
  ): AsyncIterableIterator<Id[]> {
    yield* this.getPaginated<Id>(
      `${this.singularEndpoint}/${modelId}/${getAdminModelPluralEndpoint(association)}`,
      (lastResult) => lastResult,
    );
  }

  async removeAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    return this.httpCommunicator.delete(
      `${this.singularEndpoint}/${modelId}/${association}/${associationId}`,
    );
  }

  private getPaginatedLastId<R>(result: R): Id {
    if (typeof result === "object" && result !== null && "id" in result) {
      const id = (result as { id: Id }).id;
      if (typeof id === "number") return id;
    }

    throw new Error("Paginated result does not include a numeric id");
  }

  public async *getPaginated<R>(
    endpoint: string,
    getLastId?: (lastResult: R) => Id,
  ): AsyncIterableIterator<R[]> {
    const fetchLastId = getLastId || this.getPaginatedLastId.bind(this);
    let lastId: number | undefined = undefined;

    while (true) {
      const modelEndpoint: string =
        lastId !== undefined ? `${endpoint}?lastId=${lastId}` : endpoint;

      const models = await this.httpCommunicator.get<R[]>(modelEndpoint);

      if (models.length === 0) {
        break;
      }

      yield models;

      lastId = fetchLastId(models[models.length - 1]!);
    }
  }
}

const stripModelType = <T extends { id: Id }>(
  model: Partial<T> & Pick<T, "id">,
): UpdateModel<T> => {
  const { type: _type, ...request } = model as Partial<T> &
    Pick<T, "id"> & {
      type?: ModelType;
    };

  return request as UpdateModel<T>;
};
