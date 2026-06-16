import { Header, Main } from "@components/index.ts";
import { useAdminPresenter } from "@context/index.ts";
import {
  HomeMediaDisplay,
  MediaMetadata,
  MediaVersion,
  ModelType,
  RentalModel,
  RentalModelUnion,
} from "@model/index.ts";
import type { Id } from "@model/Id.ts";
import { displayError, displayMessage } from "@pages/common.ts";
import { type AdminView } from "@presenters/AdminPresenter.ts";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminModelTable } from "./AdminModelTable.tsx";
import { AdminSidebar } from "./AdminSidebar.tsx";
import { AdminToolbar } from "./AdminToolbar.tsx";
import { AdminUploadModal } from "./AdminUploadModal.tsx";
import { CreateDrawer } from "./CreateDrawer.tsx";
import { DetailDrawer } from "./DetailDrawer.tsx";
import { ReorderModal } from "./ReorderModal.tsx";

const emptyModelRecord = (): Record<ModelType, RentalModel[]> => ({
  [ModelType.EVENT_TYPE]: [],
  [ModelType.COLLECTION]: [],
  [ModelType.CATEGORY]: [],
  [ModelType.PACKAGE]: [],
  [ModelType.PRODUCT]: [],
  [ModelType.MEDIA]: [],
  [ModelType.HOME_MEDIA]: [],
});

const emptyModelMediaRecord = (): Record<
  ModelType,
  Record<Id, MediaMetadata[]>
> => ({
  [ModelType.EVENT_TYPE]: {},
  [ModelType.COLLECTION]: {},
  [ModelType.CATEGORY]: {},
  [ModelType.PACKAGE]: {},
  [ModelType.PRODUCT]: {},
  [ModelType.MEDIA]: {},
  [ModelType.HOME_MEDIA]: {},
});

const emptyModelAssociationRecord = (): Record<
  ModelType,
  Record<Id, Partial<Record<ModelType, RentalModel[]>>>
> => ({
  [ModelType.EVENT_TYPE]: {},
  [ModelType.COLLECTION]: {},
  [ModelType.CATEGORY]: {},
  [ModelType.PACKAGE]: {},
  [ModelType.PRODUCT]: {},
  [ModelType.MEDIA]: {},
  [ModelType.HOME_MEDIA]: {},
});

const catalogModelTypes = new Set<string>(Object.values(ModelType));

const getCatalogTypeFromParams = (params: URLSearchParams): ModelType => {
  const type = params.get("type");
  return type && catalogModelTypes.has(type)
    ? (type as ModelType)
    : ModelType.EVENT_TYPE;
};

const getCatalogIdFromParams = (params: URLSearchParams): Id | null => {
  const id = Number(params.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const AdminCatalog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [models, setModels] =
    useState<Record<ModelType, RentalModel[]>>(emptyModelRecord);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<RentalModelUnion | null>(
    null,
  );
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [modelMedia, setModelMedia] = useState<
    Record<ModelType, Record<Id, MediaMetadata[]>>
  >(emptyModelMediaRecord);
  const [mediaVersions, setMediaVersions] = useState<
    Record<Id, MediaVersion[]>
  >({});
  const [modelAssociations, setModelAssociations] = useState<
    Record<ModelType, Record<Id, Partial<Record<ModelType, RentalModel[]>>>>
  >(emptyModelAssociationRecord);
  const [searchResults, setSearchResults] = useState<
    Partial<Record<ModelType, RentalModel[]>>
  >({});

  const selectedModelRef = useRef<RentalModelUnion | null>(null);

  const setCurrentSelectedModel = (model: RentalModelUnion | null) => {
    selectedModelRef.current = model;
    setSelectedModel(model);
  };

  const viewRef = useRef<AdminView>({
    displayError,
    displayMessage,
    navigate,
    setLoading,
    setAllModels: (type, nextModels) => {
      setModels((prev) => ({ ...prev, [type]: nextModels }));
    },
    setSelectedModel: setCurrentSelectedModel,
    addModelToList: (type, model) => {
      setModels((prev) => ({ ...prev, [type]: [model, ...prev[type]] }));
    },
    removeModelFromList: (type, modelId) => {
      setModels((prev) => ({
        ...prev,
        [type]: prev[type].filter((model) => model.id !== modelId),
      }));
    },
    updateModelInList: (type, model) => {
      setModels((prev) => ({
        ...prev,
        [type]: prev[type].map((current) =>
          current.id === model.id ? model : current,
        ),
      }));
      setSelectedModel((current) => {
        const next =
          current && current.type === type && current.id === model.id
            ? ({ ...current, ...model } as RentalModelUnion)
            : current;
        selectedModelRef.current = next;
        return next;
      });
    },
    updateAssociatedModels: (type, associatedModels) => {
      const model = selectedModelRef.current;
      if (!model) return;

      setModelAssociations((prev) => ({
        ...prev,
        [model.type]: {
          ...prev[model.type],
          [model.id]: {
            ...(prev[model.type][model.id] || {}),
            [type]: associatedModels,
          },
        },
      }));
    },
    setSearchResults: (type, results) => {
      setSearchResults((prev) => ({ ...prev, [type]: results }));
    },
    setModelMedia: (type, modelId, media) => {
      setModelMedia((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [modelId]: media,
        },
      }));
    },
    setMediaVersions: (mediaId, versions) => {
      setMediaVersions((prev) => ({ ...prev, [mediaId]: versions }));
    },
  });

  const presenter = useAdminPresenter(viewRef.current);
  const activeTab = getCatalogTypeFromParams(searchParams);
  const urlSelectedId = getCatalogIdFromParams(searchParams);

  useEffect(() => {
    presenter.onMount();
  }, [presenter]);

  useEffect(() => {
    if (urlSelectedId === null) {
      if (selectedModel !== null) {
        setCurrentSelectedModel(null);
      }
      return;
    }

    if (
      selectedModel?.type === activeTab &&
      selectedModel.id === urlSelectedId
    ) {
      return;
    }

    presenter.selectModel(activeTab, urlSelectedId);
  }, [presenter, selectedModel, activeTab, urlSelectedId]);

  const createPresenter = useMemo(
    () => presenter.createPresenterFor(activeTab),
    [activeTab, presenter],
  );

  const homeMediaModels = models[ModelType.HOME_MEDIA].filter(
    (model): model is HomeMediaDisplay => model.type === ModelType.HOME_MEDIA,
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    presenter.searchModels(activeTab, query);
  };

  const handleSelectTab = (type: ModelType) => {
    setSearchQuery("");
    setCurrentSelectedModel(null);
    setSearchParams({ type });
  };

  const handleSelectModel = (id: Id) => {
    setSearchParams({ type: activeTab, id: String(id) });
  };

  const handleCloseDrawer = () => {
    setCurrentSelectedModel(null);
    setSearchParams({ type: activeTab });
  };

  const handleDelete = async (event: React.MouseEvent, id: Id) => {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this item?")) {
      await presenter.deleteModel(activeTab, id);
    }
  };

  const handleCreateButtonClick = () => {
    if (activeTab === ModelType.MEDIA) {
      setIsUploading(true);
      return;
    }

    setIsCreateDrawerOpen(true);
  };

  const handleUploadSuccess = () => {
    setIsUploading(false);
    presenter.loadAllModels();
  };

  return (
    <>
      <Header />
      <Main className="flex min-h-0 p-0">
        <div className="flex w-full h-[calc(100vh-5rem)] overflow-hidden">
          <AdminSidebar activeTab={activeTab} onSelectTab={handleSelectTab} />

          <div className="flex-1 flex flex-col bg-gbh-cream overflow-hidden">
            <AdminToolbar
              activeTab={activeTab}
              searchQuery={searchQuery}
              showReorder={
                activeTab === ModelType.HOME_MEDIA &&
                models[ModelType.HOME_MEDIA].length > 1
              }
              onSearch={handleSearch}
              onCreate={handleCreateButtonClick}
              onReorder={() => setIsReorderModalOpen(true)}
            />
            <AdminModelTable
              activeTab={activeTab}
              models={models[activeTab]}
              loading={loading}
              modelMedia={modelMedia[activeTab]}
              mediaVersions={mediaVersions}
              onSelect={handleSelectModel}
              onDelete={handleDelete}
              onUpdateTags={(model, tags) =>
                presenter.updateModel(activeTab, { ...model, tags })
              }
            />
          </div>
        </div>
      </Main>

      {selectedModel && (
        <DetailDrawer
          model={selectedModel}
          modelType={selectedModel.type}
          onClose={handleCloseDrawer}
          presenter={presenter}
          searchResults={searchResults}
          navigate={navigate}
          modelMedia={modelMedia[selectedModel.type][selectedModel.id] || []}
          mediaVersions={mediaVersions}
          associations={
            modelAssociations[selectedModel.type][selectedModel.id] || {}
          }
          associationTypes={presenter.getAssociationTypesForModel(
            selectedModel.type,
          )}
          onUploadMedia={presenter.uploadMedia.bind(presenter)}
        />
      )}

      {isCreateDrawerOpen && createPresenter && (
        <CreateDrawer
          presenter={createPresenter}
          onClose={() => setIsCreateDrawerOpen(false)}
          onSuccess={() => {
            setIsCreateDrawerOpen(false);
            presenter.loadAllModels();
          }}
          searchModels={presenter.searchModels.bind(presenter)}
          searchResults={searchResults}
          displayError={displayError}
          isHomeMediaTab={activeTab === ModelType.HOME_MEDIA}
          onUploadMedia={presenter.uploadMedia.bind(presenter)}
        />
      )}

      {isReorderModalOpen && (
        <ReorderModal
          images={homeMediaModels}
          mediaVersions={mediaVersions}
          onClose={() => setIsReorderModalOpen(false)}
          onSave={(ids) => presenter.reorderHomeMedia(ids)}
        />
      )}

      {isUploading && (
        <AdminUploadModal
          onSubmit={presenter.uploadMedia.bind(presenter)}
          onUploadSuccess={handleUploadSuccess}
          onCancel={() => setIsUploading(false)}
        />
      )}
    </>
  );
};

export default AdminCatalog;
