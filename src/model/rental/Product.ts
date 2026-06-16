import { ModelType } from "./ModelType.ts";
import type { RentalModel } from "./RentalModel.ts";

export interface Product extends RentalModel {
  type: ModelType.PRODUCT;
  price: number;
  totalQuantity: number;
}
