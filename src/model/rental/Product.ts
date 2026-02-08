import type { RentalModel } from "./RentalModel.js";

export interface Product extends RentalModel {
  price: number;
}
