import { ModelType } from "./ModelType.ts";
import type { RentalModel } from "./RentalModel.ts";

export interface Category extends RentalModel {
  type: ModelType.CATEGORY;
}
