import {
  HomeMediaDisplay,
  MediaMetadata,
  MediaVersion,
  ModelType,
  RentalModel,
} from "@model/index.ts";
import type { Id } from "@model/Id.ts";
import {
  adminModelSupportsTags,
  getAdminModelPluralName,
} from "@presenters/admin/adminModelConfig.ts";
import { LazyMedia } from "@components/media/LazyMedia.tsx";
import { MediaCarousel } from "@components/admin/MediaCarousel.tsx";
import { ChevronRight, Search, Trash2 } from "lucide-react";
import { adminStyles } from "./adminStyles.ts";
import { TagEditor } from "./TagEditor.tsx";

interface AdminModelTableProps {
  activeTab: ModelType;
  models: RentalModel[];
  loading: boolean;
  modelMedia: Record<Id, MediaMetadata[]>;
  mediaVersions: Record<Id, MediaVersion[]>;
  onSelect: (modelId: Id) => void;
  onDelete: (event: React.MouseEvent, modelId: Id) => void;
  onUpdateTags: (model: RentalModel, tags: string[]) => Promise<void>;
}

const isHomeMediaDisplay = (model: RentalModel): model is HomeMediaDisplay =>
  model.type === ModelType.HOME_MEDIA;

export const AdminModelTable = ({
  activeTab,
  models,
  loading,
  modelMedia,
  mediaVersions,
  onSelect,
  onDelete,
  onUpdateTags,
}: AdminModelTableProps) => {
  const showTags = adminModelSupportsTags(activeTab);

  return (
    <div className="flex-1 overflow-y-auto [scrollbar-gutter:stable] p-8 font-montserrat-light">
      <div className={`${adminStyles.panel} overflow-hidden`}>
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center text-gbh-green/70 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gbh-gold"></div>
            <span className="font-medium font-montserrat-light">
              Loading {getAdminModelPluralName(activeTab).toLowerCase()}...
            </span>
          </div>
        ) : models.length === 0 ? (
          <div className="p-24 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gbh-gold/10 text-gbh-gold mb-4">
              <Search size={32} />
            </div>
            <h3 className={`${adminStyles.heading} text-3xl mb-1`}>
              No results found
            </h3>
            <p className="text-gbh-black/60 font-montserrat-light">
              Try adjusting your search or create a new entry.
            </p>
          </div>
        ) : (
          <table className="w-full table-fixed text-left border-collapse">
            <thead>
              <tr className="bg-gbh-green text-gbh-cream border-b border-gbh-gold/25">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest w-32">
                  Preview
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest w-64">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest hidden lg:table-cell">
                  Description
                </th>
                {showTags && (
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest w-80">
                    Tags
                  </th>
                )}
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gbh-gold/15">
              {models.map((model) => (
                <tr
                  key={`${model.type}-${model.id}`}
                  onClick={() => onSelect(model.id)}
                  className="hover:bg-gbh-cream/70 cursor-pointer group transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-24 h-16 rounded-md overflow-hidden bg-gbh-cream border border-gbh-gold/25 group-hover:border-gbh-gold transition-colors">
                      {model.type === ModelType.MEDIA ? (
                        <LazyMedia
                          key={`media-${model.id}`}
                          media={model as MediaMetadata}
                          versions={mediaVersions[model.id]}
                          preferredResolution="thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : isHomeMediaDisplay(model) ? (
                        model.media && (
                          <LazyMedia
                            key={`home-media-${model.id}-${model.mediaMetadataId}`}
                            media={model.media}
                            versions={mediaVersions[model.mediaMetadataId]}
                            preferredResolution="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <MediaCarousel
                          key={`${model.type}-${model.id}`}
                          images={modelMedia[model.id] || []}
                          versions={mediaVersions}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gbh-black group-hover:text-gbh-green transition-colors">
                      {model.name}
                    </div>
                    {isHomeMediaDisplay(model) && (
                      <div className="text-[10px] bg-gbh-gold/15 text-gbh-green px-2 py-0.5 rounded-full inline-block mt-1 uppercase font-bold tracking-wide">
                        Order: {model.displayOrder}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="text-sm text-gbh-black/60 line-clamp-1 max-w-2xl">
                      {model.description}
                    </div>
                  </td>
                  {showTags && (
                    <td
                      className="px-6 py-4 align-top"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <TagEditor
                        tags={model.tags}
                        editable
                        compact
                        onChange={(tags) => onUpdateTags(model, tags)}
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={(event) => onDelete(event, model.id)}
                        className="p-2 text-gbh-black/25 hover:text-red-700 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="p-2 text-gbh-black/25 group-hover:text-gbh-gold group-hover:translate-x-1 transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
