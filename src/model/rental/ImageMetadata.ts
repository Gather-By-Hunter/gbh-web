import type { Id } from "@model/Id.js";

export interface ImageMetadata {
  id: Id;
  url: string;
  alt: string;
  objectPosition?: string;
}
