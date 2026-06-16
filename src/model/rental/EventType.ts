import { ModelType } from "./ModelType.ts";
import type { RentalModel } from "./RentalModel.ts";

export interface EventType extends RentalModel {
  type: ModelType.EVENT_TYPE;
}
