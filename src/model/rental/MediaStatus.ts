export const MediaStatus = {
  PENDING: "pending",
  READY: "ready",
  FAILED: "failed",
} as const;

export type MediaStatus = (typeof MediaStatus)[keyof typeof MediaStatus];
