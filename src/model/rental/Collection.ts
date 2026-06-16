import { ModelType } from "./ModelType.ts";
import type { RentalModel } from "./RentalModel.ts";

export interface Collection extends RentalModel {
  type: ModelType.COLLECTION;
}
