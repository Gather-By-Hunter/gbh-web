import { MediaUpload } from "@components/admin/MediaUpload.tsx";
import type { MediaMetadata, UploadMediaRequest } from "@model/index.ts";

interface AdminUploadModalProps {
  onSubmit: (request: UploadMediaRequest) => Promise<MediaMetadata>;
  onUploadSuccess: (media: MediaMetadata) => void;
  onCancel: () => void;
}

export const AdminUploadModal = ({
  onSubmit,
  onUploadSuccess,
  onCancel,
}: AdminUploadModalProps) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gbh-black/50 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      <div className="relative w-full max-w-lg animate-in zoom-in duration-200">
        <MediaUpload
          onSubmit={onSubmit}
          onUploadSuccess={onUploadSuccess}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
