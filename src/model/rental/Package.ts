import type { RentalModel } from "./RentalModel.js";

export interface Package extends RentalModel {
  percentDiscount: number;
}
