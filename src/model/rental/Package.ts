import { ModelType } from "./ModelType.ts";
import type { RentalModel } from "./RentalModel.ts";

export interface Package extends RentalModel {
  type: ModelType.PACKAGE;
  percentDiscount: number;
}
