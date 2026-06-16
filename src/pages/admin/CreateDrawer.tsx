import { useState, useEffect } from "react";
import {
  CreateFormData,
  CreatePresenter,
} from "@presenters/admin/CreatePresenter.ts";
import { MediaMetadata, ModelType, RentalModel } from "@model/index.ts";
import { Id } from "@model/Id.ts";
import { MediaUpload } from "@components/admin/MediaUpload.tsx";
import type { UploadMediaRequest } from "@model/index.ts";
import { AssociationPicker } from "./AssociationPicker.tsx";
import { SelectedAssociations } from "./SelectedAssociations.tsx";
import { adminStyles } from "./adminStyles.ts";
import { TagEditor } from "./TagEditor.tsx";

interface CreateDrawerProps {
  presenter: CreatePresenter;
  onClose: () => void;
  onSuccess: () => void;
  searchModels: (type: ModelType, query: string) => Promise<void>;
  searchResults: Partial<Record<ModelType, RentalModel[]>>;
  displayError: (msg: string) => void;
  isHomeMediaTab?: boolean;
  onUploadMedia: (request: UploadMediaRequest) => Promise<MediaMetadata>;
}

const getTagFieldValue = (
  formData: CreateFormData,
  fieldName: string,
): string[] => {
  const value = formData[fieldName];
  return Array.isArray(value) ? value : [];
};

export const CreateDrawer = ({
  presenter,
  onClose,
  onSuccess,
  searchModels,
  searchResults,
  displayError,
  isHomeMediaTab = false,
  onUploadMedia,
}: CreateDrawerProps) => {
  const [formData, setFormData] = useState<CreateFormData>({});
  const [selectedAssociations, setSelectedAssociations] = useState<
    Partial<Record<ModelType, RentalModel[]>>
  >({});
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const initialData: CreateFormData = {};
    presenter.getFields().forEach((f) => {
      initialData[f.name] =
        f.type === "tags" ? [] : f.type === "number" && f.required ? 0 : "";
    });
    setFormData(initialData);
  }, [presenter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For home media, the selected media association supplies the metadata ID.
    const dataToSubmit = { ...formData };
    if (isHomeMediaTab) {
      const selectedMedia = selectedAssociations[ModelType.MEDIA]?.[0];
      if (!selectedMedia) {
        displayError("Please select media from the library");
        return;
      }
      dataToSubmit.mediaMetadataId = selectedMedia.id;
    }

    const error = presenter.validate(dataToSubmit);
    if (error) {
      displayError(error);
      return;
    }

    setLoading(true);
    try {
      const associations: Partial<Record<ModelType, Id[]>> = {};
      Object.entries(selectedAssociations).forEach(([type, items]) => {
        if (items) associations[type as ModelType] = items.map((m) => m.id);
      });

      await presenter.create(dataToSubmit, associations);
      onSuccess();
    } catch (e) {
      displayError(e instanceof Error ? e.message : "Failed to create model");
    } finally {
      setLoading(false);
    }
  };

  const toggleAssociation = (type: ModelType, model: RentalModel) => {
    setSelectedAssociations((prev) => {
      const currentList = prev[type] || [];
      const isSelected = currentList.some((m) => m.id === model.id);

      // Special case: Home media only allows one media selection
      if (isHomeMediaTab && type === ModelType.MEDIA) {
        return { ...prev, [type]: [model] };
      }

      if (isSelected) {
        return {
          ...prev,
          [type]: currentList.filter((m) => m.id !== model.id),
        };
      } else {
        return { ...prev, [type]: [...currentList, model] };
      }
    });
  };

  const handleUploadSuccess = (image: RentalModel) => {
    toggleAssociation(ModelType.MEDIA, image);
    setIsUploading(false);
  };

  // Filter out fields handled through media selection for home media.
  const visibleFields = isHomeMediaTab
    ? presenter.getFields().filter((f) => f.name !== "mediaMetadataId")
    : presenter.getFields();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-gbh-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl bg-gbh-white h-full shadow-2xl flex flex-col animate-slide-in-right font-montserrat-light">
        <header className="p-6 border-b border-gbh-gold/25 flex justify-between items-center bg-gbh-cream">
          <h2 className={`${adminStyles.heading} text-4xl`}>
            {isHomeMediaTab ? "Add to Home Screen" : "Create New"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gbh-gold/15 rounded-full text-2xl text-gbh-black"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
          {visibleFields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {visibleFields.map((field) => (
                <div
                  key={field.name}
                  className={field.type === "text" ? "md:col-span-2" : ""}
                >
                  <label className={adminStyles.label}>
                    {field.displayName}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === "tags" ? (
                    <TagEditor
                      tags={getTagFieldValue(formData, field.name)}
                      editable
                      onChange={(tags) =>
                        setFormData({
                          ...formData,
                          [field.name]: tags,
                        })
                      }
                    />
                  ) : field.type === "text" ? (
                    <textarea
                      required={field.required}
                      rows={3}
                      className={adminStyles.input}
                      value={formData[field.name] ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.name]: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      step={field.type === "number" ? "any" : undefined}
                      required={field.required}
                      className={adminStyles.input}
                      value={formData[field.name] ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.name]:
                            field.type === "number"
                              ? e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                              : e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-10">
            {presenter.getAllowedAssociations().map((type) => (
              <div key={type} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AssociationPicker
                  type={type}
                  searchResults={searchResults[type] || []}
                  selectedItems={selectedAssociations[type] || []}
                  isSingleSelection={isHomeMediaTab && type === ModelType.MEDIA}
                  heading={
                    isHomeMediaTab && type === ModelType.MEDIA
                      ? "1. Select Media from Library"
                      : undefined
                  }
                  onSearch={(query) => searchModels(type, query)}
                  onToggle={(item) => toggleAssociation(type, item)}
                  onUploadNew={
                    type === ModelType.MEDIA
                      ? () => setIsUploading(true)
                      : undefined
                  }
                />
                <SelectedAssociations
                  type={type}
                  selectedItems={selectedAssociations[type] || []}
                  isSingleSelection={isHomeMediaTab && type === ModelType.MEDIA}
                  onRemove={(item) => toggleAssociation(type, item)}
                />
              </div>
            ))}
          </div>

          <div className="mt-12 sticky bottom-0 bg-gbh-white py-6 border-t border-gbh-gold/25 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className={adminStyles.secondaryButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={adminStyles.primaryButton}
            >
              {loading
                ? "Saving..."
                : isHomeMediaTab
                  ? "Add to Home"
                  : "Create"}
            </button>
          </div>
        </form>

        {isUploading && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gbh-black/50 backdrop-blur-sm"
              onClick={() => setIsUploading(false)}
            ></div>
            <div className="relative w-full max-w-lg animate-in zoom-in duration-200">
              <MediaUpload
                onSubmit={onUploadMedia}
                onUploadSuccess={handleUploadSuccess}
                onCancel={() => setIsUploading(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
