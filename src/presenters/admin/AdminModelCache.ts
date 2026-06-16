import {
  MediaMetadata,
  ModelType,
  RentalModel,
  RentalModelUnion,
} from "@model/index.ts";
import type { Id } from "@model/Id.ts";

export class AdminModelCache {
  private readonly models = new Map<string, RentalModel>();

  set(type: ModelType, model: RentalModel): void {
    this.models.set(this.key(type, model.id), model);
  }

  get(type: ModelType, id: Id): RentalModel | undefined {
    return this.models.get(this.key(type, id));
  }

  getMedia(id: Id): MediaMetadata | undefined {
    const media = this.get(ModelType.MEDIA, id);
    return media ? (media as MediaMetadata) : undefined;
  }

  delete(type: ModelType, id: Id): void {
    this.models.delete(this.key(type, id));
  }

  valuesFor(type: ModelType): RentalModel[] {
    const prefix = `${type}-`;
    return Array.from(this.models.entries())
      .filter(([key]) => key.startsWith(prefix))
      .map(([, model]) => model);
  }

  setMany(type: ModelType, models: RentalModel[]): void {
    for (const model of models) {
      this.set(type, model);
    }
  }

  private key(type: ModelType, id: Id): string {
    return `${type}-${id}`;
  }
}

export const isRentalModelUnion = (
  model: RentalModel,
): model is RentalModelUnion => {
  return Object.values(ModelType).includes(model.type);
};
