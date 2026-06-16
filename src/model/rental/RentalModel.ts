import type { Id } from "@model/Id.ts";
import type { ModelType } from "./ModelType.ts";
import type { Category } from "./Category.ts";
import type { Collection } from "./Collection.ts";
import type { EventType } from "./EventType.ts";
import type { Package } from "./Package.ts";
import type { Product } from "./Product.ts";
import type { MediaMetadata } from "./MediaMetadata.ts";
import type { HomeMediaDisplay } from "./HomeMedia.ts";

export interface RentalModel {
  id: Id;
  name: string;
  description: string;
  type: ModelType;
  tags?: string[];
}

export type RentalModelUnion =
  | Category
  | Collection
  | EventType
  | Package
  | Product
  | MediaMetadata
  | HomeMediaDisplay;
