import type { Id } from "@model/Id.ts";

export const MediaUploadStatus = {
  PENDING: "pending",
  UPLOADING: "uploading",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type MediaUploadStatus =
  (typeof MediaUploadStatus)[keyof typeof MediaUploadStatus];

export interface UploadPart {
  ETag: string;
  PartNumber: number;
}

export interface UploadMediaRequest {
  file: File;
  name: string;
  title: string;
  description: string;
}

export interface MediaUpload {
  id: Id;
  name: string;
  title: string;
  description: string;
  status: MediaUploadStatus;
  uploadId: string;
  partCount: number;
}
