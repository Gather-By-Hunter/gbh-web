import { useState } from "react";
import type { MediaMetadata, UploadMediaRequest } from "@model/index.ts";
import { adminStyles } from "@pages/admin/adminStyles.ts";

interface MediaUploadProps {
  onSubmit: (request: UploadMediaRequest) => Promise<MediaMetadata>;
  onUploadSuccess: (image: MediaMetadata) => void;
  onCancel: () => void;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Failed to upload media";
};

export const MediaUpload = ({
  onSubmit,
  onUploadSuccess,
  onCancel,
}: MediaUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!name) setName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !title || !description) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mediaMetadata = await onSubmit({
        file,
        name,
        title,
        description,
      });
      onUploadSuccess(mediaMetadata);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${adminStyles.panel} p-6 font-montserrat-light`}>
      <h3 className={`${adminStyles.heading} text-3xl mb-4`}>
        Upload New Media
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={adminStyles.label}>File</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={adminStyles.input}
            required
          />
        </div>
        <div>
          <label className={adminStyles.label}>Internal Name (e.g. wine-glass.jpg)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={adminStyles.input}
            required
          />
        </div>
        <div>
          <label className={adminStyles.label}>Title / Alt Text (Descriptive)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={adminStyles.input}
            required
          />
        </div>
        <div>
          <label className={adminStyles.label}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={adminStyles.input}
            rows={2}
            required
          />
        </div>

        {error && <div className="text-red-700 text-sm">{error}</div>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className={adminStyles.secondaryButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={adminStyles.primaryButton}
          >
            {loading ? "Uploading..." : "Upload & Select"}
          </button>
        </div>
      </form>
    </div>
  );
};
