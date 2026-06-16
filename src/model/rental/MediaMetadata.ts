import { ModelType } from "./ModelType.ts";
import type { RentalModel } from "./RentalModel.ts";

export interface MediaMetadata extends RentalModel {
  type: ModelType.MEDIA;
  namespace: string;
  title: string;
  blurData: string;
  objectPosition?: string;
}
