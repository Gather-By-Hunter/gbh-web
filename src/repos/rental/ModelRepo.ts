import type { HttpCommunicator } from "@api/HttpCommunicator.ts";
import type { Id } from "@model/Id.ts";
import type { RentalModel } from "@model/index.ts";

export enum ModelType {
  EVENT_TYPE = "event-type",
  COLLECTION = "collection",
  CATEGORY = "category",
  PACKAGE = "package",
  PRODUCT = "product",
  IMAGE = "image",
}

enum PluralModelTypeApi {
  EVENT_TYPES = "event-types",
  COLLECTIONS = "collections",
  CATEGORIES = "categories",
  PACKAGES = "packages",
  PRODUCTS = "products",
  IMAGES = "images",
}

const associationToPlural: Record<ModelType, PluralModelTypeApi> = {
  [ModelType.EVENT_TYPE]: PluralModelTypeApi.EVENT_TYPES,
  [ModelType.COLLECTION]: PluralModelTypeApi.COLLECTIONS,
  [ModelType.CATEGORY]: PluralModelTypeApi.CATEGORIES,
  [ModelType.PACKAGE]: PluralModelTypeApi.PACKAGES,
  [ModelType.PRODUCT]: PluralModelTypeApi.PRODUCTS,
  [ModelType.IMAGE]: PluralModelTypeApi.IMAGES,
};

export class ModelRepo<T extends RentalModel> {
  constructor(
    protected httpCommunicator: HttpCommunicator,
    protected endpoint: string,
    protected paginatedEndpoint?: string,
  ) {}

  async create(model: Omit<T, "id">) {
    return this.httpCommunicator.post<{ id: Id }>(this.endpoint, model);
  }

  async get(modelId: Id) {
    return this.httpCommunicator.get<T>(`${this.endpoint}/${modelId}`);
  }

  async update(model: Partial<T> & Pick<T, "id">) {
    return this.httpCommunicator.patch(this.endpoint, model);
  }

  async *getAll() {
    yield* this.getPaginated<T>(
      this.paginatedEndpoint ? this.paginatedEndpoint : `${this.endpoint}s`,
    );
  }

  async delete(modelId: Id) {
    return this.httpCommunicator.delete(`${this.endpoint}/${modelId}`);
  }

  async *getModels(): AsyncIterableIterator<T[]> {
    yield* this.getPaginated<T>(this.endpoint);
  }

  async createAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    return this.httpCommunicator.put(
      `${this.endpoint}/${modelId}/${association}/${associationId}`,
    );
  }

  async *getAssociations(
    modelId: Id,
    association: ModelType,
  ): AsyncIterableIterator<Id[]> {
    yield* this.getPaginated<Id>(
      `${this.endpoint}/${modelId}/${associationToPlural[association]}`,
      (lastResult) => lastResult,
    );
  }

  async removeAssociation(
    modelId: Id,
    associationId: Id,
    association: ModelType,
  ) {
    return this.httpCommunicator.delete(
      `${this.endpoint}/${modelId}/${association}/${associationId}`,
    );
  }

  protected async *getPaginated<T>(
    endpoint: string,
    getLastId?: (lastResult: T) => Id,
  ): AsyncIterableIterator<T[]> {
    if (!getLastId) getLastId = (lastResult) => (lastResult as RentalModel)?.id;
    let lastId: number | undefined = undefined;

    while (true) {
      const modelEndpoint: string =
        lastId !== undefined ? `${endpoint}?lastId=${lastId}` : endpoint;

      const models = await this.httpCommunicator.get<T[]>(modelEndpoint);

      if (models.length === 0) {
        break;
      }

      yield models;

      lastId = getLastId(models[models.length - 1]);
    }
  }
}
