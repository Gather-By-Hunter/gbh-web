import { useEffect, useState } from "react";
import { MediaUpload } from "@components/admin/MediaUpload.tsx";
import {
  MediaMetadata,
  MediaVersion,
  ModelType,
  PackageProductDisplay,
  RentalModel,
  RentalModelUnion,
  type UploadMediaRequest,
} from "@model/index.ts";
import { Id } from "@model/Id.ts";
import { getAdminModelSingularName } from "@presenters/admin/adminModelConfig.ts";
import { AdminPresenter } from "@presenters/AdminPresenter.ts";
import { EditableModelFields } from "./EditableModelFields.tsx";
import { MediaAssociationSection } from "./MediaAssociationSection.tsx";
import { PackageProductsSection } from "./PackageProductsSection.tsx";
import { adminStyles } from "./adminStyles.ts";

interface DetailDrawerProps {
  model: RentalModelUnion;
  modelType: ModelType;
  onClose: () => void;
  presenter: AdminPresenter;
  searchResults: Partial<Record<ModelType, RentalModel[]>>;
  navigate: (path: string) => void;
  modelMedia: MediaMetadata[];
  mediaVersions: Record<number, MediaVersion[]>;
  associations: Partial<Record<ModelType, RentalModel[]>>;
  associationTypes: ModelType[];
  onUploadMedia: (request: UploadMediaRequest) => Promise<MediaMetadata>;
}

export const DetailDrawer = ({
  model,
  modelType,
  onClose,
  presenter,
  searchResults,
  navigate,
  modelMedia,
  mediaVersions,
  associations,
  associationTypes,
  onUploadMedia,
}: DetailDrawerProps) => {
  const [editData, setEditData] = useState<RentalModelUnion>({ ...model });
  const [isUploading, setIsUploading] = useState(false);
  const [activeSearchType, setActiveSearchType] = useState<ModelType | null>(
    null,
  );
  const [packageProducts, setPackageProducts] = useState<
    PackageProductDisplay[]
  >([]);

  useEffect(() => {
    setEditData({ ...model });
    setActiveSearchType(null);
  }, [model]);

  useEffect(() => {
    let active = true;

    const loadPackageProducts = async () => {
      if (modelType !== ModelType.PACKAGE) {
        setPackageProducts([]);
        return;
      }

      const items = await presenter.getPackageProducts(model.id);
      if (active) setPackageProducts(items);
    };

    loadPackageProducts();

    return () => {
      active = false;
    };
  }, [model.id, modelType, presenter]);

  const handleSave = async () => {
    await presenter.updateModel(modelType, editData);
  };

  const handleAddAssoc = async (type: ModelType, assocId: Id) => {
    await presenter.addAssociation(model.id, modelType, assocId, type);
    setActiveSearchType(null);
  };

  const handleRemoveAssoc = async (type: ModelType, assocId: Id) => {
    if (
      confirm(
        `Are you sure you want to remove this ${getAdminModelSingularName(type)}?`,
      )
    ) {
      await presenter.removeAssociation(model.id, modelType, assocId, type);
    }
  };

  const handleSetPackageProductQuantity = async (
    productId: Id,
    quantity: number,
  ) => {
    const items = await presenter.setPackageProductQuantity(
      model.id,
      productId,
      quantity,
    );
    setPackageProducts(items);
    setActiveSearchType(null);
  };

  const handleRemovePackageProduct = async (productId: Id) => {
    if (
      confirm("Are you sure you want to remove this product from the package?")
    ) {
      const items = await presenter.removePackageProduct(model.id, productId);
      setPackageProducts(items);
    }
  };

  const handleTogglePackageProductSearch = () => {
    const nextSearchType =
      activeSearchType === ModelType.PRODUCT ? null : ModelType.PRODUCT;
    setActiveSearchType(nextSearchType);
    if (nextSearchType === ModelType.PRODUCT) {
      presenter.searchModels(ModelType.PRODUCT, "");
    }
  };

  const openAssociatedModel = (type: ModelType, itemId: Id) => {
    navigate(`/admin/catalog?type=${type}&id=${itemId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-gbh-black/60 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl bg-gbh-white h-full shadow-2xl flex flex-col animate-slide-in-right font-montserrat-light">
        <header className="p-6 border-b border-gbh-gold/25 flex justify-between items-center bg-gbh-cream">
          <h2 className={`${adminStyles.heading} text-4xl`}>
            Edit {getAdminModelSingularName(modelType)}
          </h2>
          <div className="flex gap-3">
            <button onClick={onClose} className={adminStyles.secondaryButton}>
              Cancel
            </button>
            <button onClick={handleSave} className={adminStyles.primaryButton}>
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gbh-gold/15 rounded-full text-2xl text-gbh-black"
            >
              ×
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-10">
            <EditableModelFields editData={editData} onChange={setEditData} />
          </div>

          <div className="space-y-12">
            {modelType === ModelType.PACKAGE && (
              <PackageProductsSection
                packageProducts={packageProducts}
                searchResults={searchResults[ModelType.PRODUCT] || []}
                showSearch={activeSearchType === ModelType.PRODUCT}
                onToggleSearch={handleTogglePackageProductSearch}
                onSearch={(query) =>
                  presenter.searchModels(ModelType.PRODUCT, query)
                }
                onSetQuantity={handleSetPackageProductQuantity}
                onRemove={handleRemovePackageProduct}
              />
            )}

            <MediaAssociationSection
              modelMedia={modelMedia}
              mediaVersions={mediaVersions}
              searchResults={searchResults[ModelType.MEDIA] || []}
              showSearch={activeSearchType === ModelType.MEDIA}
              onToggleSearch={() =>
                setActiveSearchType(
                  activeSearchType === ModelType.MEDIA ? null : ModelType.MEDIA,
                )
              }
              onSearch={(query) =>
                presenter.searchModels(ModelType.MEDIA, query)
              }
              onAdd={(mediaId) => handleAddAssoc(ModelType.MEDIA, mediaId)}
              onRemove={(mediaId) =>
                handleRemoveAssoc(ModelType.MEDIA, mediaId)
              }
              onUploadNew={() => setIsUploading(true)}
            />

            {associationTypes
              .filter((type) => type !== ModelType.MEDIA)
              .map((type) => {
                const items = associations[type] || [];
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-4 border-b border-gbh-gold/25 pb-2">
                      <h3 className={`${adminStyles.heading} text-3xl`}>
                        Associated {getAdminModelSingularName(type)}s
                      </h3>
                      <button
                        onClick={() =>
                          setActiveSearchType(
                            activeSearchType === type ? null : type,
                          )
                        }
                        className={adminStyles.subtleButton}
                      >
                        {activeSearchType === type
                          ? "Close Search"
                          : `+ Add ${getAdminModelSingularName(type)}`}
                      </button>
                    </div>

                    {activeSearchType === type && (
                      <div className={`${adminStyles.insetPanel} mb-6 p-4`}>
                        <input
                          type="text"
                          placeholder={`Search ${getAdminModelSingularName(type)}s...`}
                          className={`${adminStyles.input} mb-3`}
                          onChange={(event) =>
                            presenter.searchModels(type, event.target.value)
                          }
                        />
                        <div className="max-h-48 overflow-y-auto divide-y divide-gbh-gold/15 bg-gbh-white border border-gbh-gold/25 rounded-md">
                          {searchResults[type]?.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 flex items-center justify-between hover:bg-gbh-cream/70"
                            >
                              <span className="text-sm font-medium text-gbh-black">
                                {item.name}
                              </span>
                              <button
                                onClick={() => handleAddAssoc(type, item.id)}
                                className="text-gbh-green text-sm font-bold hover:text-gbh-gold"
                              >
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="border border-gbh-gold/25 rounded-md p-4 hover:border-gbh-gold group transition-colors relative bg-gbh-white"
                        >
                          <button
                            type="button"
                            onClick={() => openAssociatedModel(type, item.id)}
                            className="block w-full pr-16 text-left"
                          >
                            <h4 className="font-bold text-gbh-black">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gbh-black/55 line-clamp-1">
                              {item.description}
                            </p>
                          </button>
                          <button
                            onClick={() => handleRemoveAssoc(type, item.id)}
                            className="absolute top-2 right-2 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {items.length === 0 && (
                        <div className="col-span-full py-4 text-center text-gbh-black/45 italic bg-gbh-cream/50 rounded-md border border-dashed border-gbh-gold/30">
                          No {getAdminModelSingularName(type)}s associated
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {isUploading && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gbh-black/50 backdrop-blur-sm"
              onClick={() => setIsUploading(false)}
            ></div>
            <div className="relative w-full max-w-lg">
              <MediaUpload
                onSubmit={onUploadMedia}
                onUploadSuccess={(media) => {
                  handleAddAssoc(ModelType.MEDIA, media.id);
                  setIsUploading(false);
                }}
                onCancel={() => setIsUploading(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
