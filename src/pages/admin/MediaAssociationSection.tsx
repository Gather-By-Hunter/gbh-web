import {
  MediaMetadata,
  MediaVersion,
  ModelType,
  RentalModel,
} from "@model/index.ts";
import type { Id } from "@model/Id.ts";
import { MediaCarousel } from "@components/admin/MediaCarousel.tsx";
import { adminStyles } from "./adminStyles.ts";

interface MediaAssociationSectionProps {
  modelMedia: MediaMetadata[];
  mediaVersions: Record<Id, MediaVersion[]>;
  searchResults: RentalModel[];
  showSearch: boolean;
  onToggleSearch: () => void;
  onSearch: (query: string) => void;
  onAdd: (mediaId: Id) => void;
  onRemove: (mediaId: Id) => void;
  onUploadNew: () => void;
}

export const MediaAssociationSection = ({
  modelMedia,
  mediaVersions,
  searchResults,
  showSearch,
  onToggleSearch,
  onSearch,
  onAdd,
  onRemove,
  onUploadNew,
}: MediaAssociationSectionProps) => {
  return (
    <div className="font-montserrat-light">
      <div className="flex justify-between items-center mb-4 border-b border-gbh-gold/25 pb-2">
        <h3 className={`${adminStyles.heading} text-3xl`}>Gallery</h3>
        <div className="flex gap-2">
          <button onClick={onToggleSearch} className={adminStyles.subtleButton}>
            {showSearch ? "Close Search" : "Add Existing"}
          </button>
          <button onClick={onUploadNew} className={adminStyles.primaryButton}>
            + Upload New
          </button>
        </div>
      </div>

      {showSearch && (
        <div className={`${adminStyles.insetPanel} mb-6 p-4`}>
          <input
            type="text"
            placeholder="Search existing media..."
            className={`${adminStyles.input} mb-3`}
            onChange={(event) => onSearch(event.target.value)}
          />
          <div className="max-h-48 overflow-y-auto divide-y divide-gbh-gold/15 bg-gbh-white border border-gbh-gold/25 rounded-md">
            {searchResults.map((media) => (
              <div
                key={media.id}
                className="p-2 flex items-center justify-between hover:bg-gbh-cream/70"
              >
                <span className="text-sm font-medium text-gbh-black">
                  {media.name}
                </span>
                <button
                  onClick={() => onAdd(media.id)}
                  className="text-gbh-green text-sm font-bold hover:text-gbh-gold"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {modelMedia.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <MediaCarousel
            images={modelMedia}
            versions={mediaVersions}
            className="h-96 w-full rounded-lg shadow-lg border border-gbh-gold/25"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {modelMedia.map((media) => (
              <div
                key={media.id}
                className="bg-gbh-gold/10 border border-gbh-gold/20 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
              >
                <span>{media.name}</span>
                <button
                  onClick={() => onRemove(media.id)}
                  className="text-red-600 font-bold hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-32 bg-gbh-cream/50 rounded-lg border-2 border-dashed border-gbh-gold/30 flex items-center justify-center text-gbh-black/45">
          No media associated
        </div>
      )}
    </div>
  );
};
