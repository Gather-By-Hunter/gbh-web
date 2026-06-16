import { Id } from "@model/Id.ts";
import { ModelType } from "./ModelType.ts";
import type { RentalModel } from "./RentalModel.ts";

import type { MediaMetadata } from "./MediaMetadata.ts";

export interface HomeMedia {
  id: Id;
  mediaMetadataId: Id;
  displayOrder: number;
}

export interface HomeMediaDisplay extends HomeMedia, RentalModel {
  type: ModelType.HOME_MEDIA;
  media?: MediaMetadata;
}
