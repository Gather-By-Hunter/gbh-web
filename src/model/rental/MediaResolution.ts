export const MediaResolution = {
  ORIGINAL: "original",
  LARGE: "large",
  MEDIUM: "medium",
  THUMBNAIL: "thumbnail",
  BLUR: "blur",
} as const;

export type MediaResolution =
  (typeof MediaResolution)[keyof typeof MediaResolution];
