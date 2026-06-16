import type { Id } from "@model/Id.ts";
import type { MediaResolution } from "./MediaResolution.ts";

export interface MediaVersion {
  id: Id;
  mediaMetadataId: Id;
  resolution: MediaResolution;
  fileType: string;
  url: string;
  width?: number | undefined;
  height?: number | undefined;
}
