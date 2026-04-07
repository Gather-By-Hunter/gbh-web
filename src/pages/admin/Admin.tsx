import { AdminPresenter, AdminView, ModelDetail } from "@presenters/AdminPresenter.ts";
import { Header, Main } from "@components/index.ts";
import { useContext, useEffect, useRef, useState, useMemo } from "react";
import { AppContext, AuthContext } from "@context/index.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { displayError, displayMessage } from "@pages/common.ts";
import { RentalModel } from "@model/index.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";
import { AdminCacheContext, AdminCacheProvider } from "@context/react-context/AdminCacheContext.tsx";
import { CreateDrawer } from "./CreateDrawer.tsx";
import { ProductCreatePresenter } from "@presenters/admin/ProductCreatePresenter.ts";
import { PackageCreatePresenter } from "@presenters/admin/PackageCreatePresenter.ts";
import { CategoryCreatePresenter } from "@presenters/admin/CategoryCreatePresenter.ts";
import { CollectionCreatePresenter } from "@presenters/admin/CollectionCreatePresenter.ts";
import { EventTypeCreatePresenter } from "@presenters/admin/EventTypeCreatePresenter.ts";

const modelNameToDisplayName: Record<ModelType, string> = {
  [ModelType.EVENT_TYPE]: "Event Type",
  [ModelType.COLLECTION]: "Collection",
  [ModelType.CATEGORY]: "Category",
  [ModelType.PACKAGE]: "Package",
  [ModelType.PRODUCT]: "Product",
  [ModelType.IMAGE]: "Image",
};

const modelTypes: ModelType[] = [
  ModelType.EVENT_TYPE,
  ModelType.COLLECTION,
  ModelType.CATEGORY,
  ModelType.PACKAGE,
  ModelType.PRODUCT,
];

const AdminContent = () => {
  const { services } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const cacheContext = useContext(AdminCacheContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!cacheContext) throw new Error("AdminContent must be used within AdminCacheProvider");
  const { cache } = cacheContext;

  const currentModelType = (searchParams.get("type") as ModelType) || ModelType.PRODUCT;
  const selectedModelId = searchParams.get("id");
  const isCreating = searchParams.get("create") === "true";

  const [models, setModels] = useState<RentalModel[]>([]);
  const [selectedModelDetail, setSelectedModelDetail] = useState<ModelDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchResults, setSearchResults] = useState<Partial<Record<ModelType, RentalModel[]>>>({});

  const viewRef = useRef<AdminView>({
    displayMessage,
    displayError,
    navigate,
    setModels,
    setSelectedModelDetail,
    updateAssociatedModels: (type, newModels) => {
      setSelectedModelDetail((prev) => {
        if (!prev) return null;
        const updatedAssociations = { ...prev.associations };
        const existingModels = updatedAssociations[type] || [];
        const uniqueNewModels = newModels.filter((m) => !existingModels.some((em) => em.id === m.id));
        updatedAssociations[type] = [...existingModels, ...uniqueNewModels];
        return { ...prev, associations: updatedAssociations };
      });
    },
    setSearchResults: (type, results) => {
      setSearchResults((prev) => ({ ...prev, [type]: results }));
    },
    setLoading,
  });

  const presenter = useMemo(() => new AdminPresenter(services, viewRef.current, cache), [services, cache]);

  useEffect(() => {
    presenter.onMount(user);
    return () => presenter.onUnmount();
  }, [user, presenter]);

  useEffect(() => {
    presenter.getModels(currentModelType);
  }, [currentModelType, presenter]);

  useEffect(() => {
    if (selectedModelId) {
      presenter.getModelDetail(currentModelType, parseInt(selectedModelId));
    } else {
      setSelectedModelDetail(null);
    }
  }, [selectedModelId, currentModelType, presenter]);

  const handleSelectModel = (type: ModelType) => {
    setSearchParams({ type });
  };

  const handleOpenDetail = (id: number) => {
    setSearchParams({ type: currentModelType, id: id.toString() });
  };

  const handleCloseDetail = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("id");
    setSearchParams(params);
  };

  const handleOpenCreate = () => {
    setSearchParams({ type: currentModelType, create: "true" });
  };

  const handleCloseCreate = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("create");
    setSearchParams(params);
  };

  const createPresenter = useMemo(() => {
    switch (currentModelType) {
      case ModelType.PRODUCT: return new ProductCreatePresenter(services);
      case ModelType.PACKAGE: return new PackageCreatePresenter(services);
      case ModelType.CATEGORY: return new CategoryCreatePresenter(services);
      case ModelType.COLLECTION: return new CollectionCreatePresenter(services);
      case ModelType.EVENT_TYPE: return new EventTypeCreatePresenter(services);
      default: return new ProductCreatePresenter(services);
    }
  }, [currentModelType, services]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-16"} bg-gray-100 border-r transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b">
          {isSidebarOpen && <span className="font-bold text-lg">Browse</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-200 rounded">
            {isSidebarOpen ? "←" : "→"}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {modelTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleSelectModel(type)}
              className={`w-full text-left p-3 rounded mb-1 transition-colors ${currentModelType === type ? "bg-blue-600 text-white" : "hover:bg-gray-200"} ${!isSidebarOpen && "text-center"}`}
              title={modelNameToDisplayName[type]}
            >
              {isSidebarOpen ? modelNameToDisplayName[type] : type.charAt(0).toUpperCase()}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 overflow-y-auto bg-white p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{modelNameToDisplayName[currentModelType]} List</h1>
          <div className="flex items-center gap-4">
            {loading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>}
            <button
              onClick={handleOpenCreate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-medium transition-colors"
            >
              + Create new {modelNameToDisplayName[currentModelType]}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => handleOpenDetail(model.id)}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow bg-white"
            >
              <h3 className="font-bold text-lg mb-2">{model.name}</h3>
              <p className="text-gray-600 line-clamp-2 mb-3">{model.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono text-gray-400">ID: {model.id}</span>
                {currentModelType === ModelType.PRODUCT && (
                  <span className="font-bold text-green-600">${(model as any).price?.toFixed(2)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {isCreating && (
        <CreateDrawer
          presenter={createPresenter}
          onClose={handleCloseCreate}
          onSuccess={() => {
            handleCloseCreate();
            presenter.getModels(currentModelType);
          }}
          searchModels={(type, query) => presenter.searchModels(type, query)}
          searchResults={searchResults}
          displayError={displayError}
        />
      )}

      {selectedModelDetail && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={handleCloseDetail}></div>
          <div className="relative w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <header className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">{modelNameToDisplayName[currentModelType]} Details</h2>
              <button onClick={handleCloseDetail} className="p-2 hover:bg-gray-100 rounded-full text-2xl">×</button>
            </header>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{selectedModelDetail.model.name}</h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">{selectedModelDetail.model.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <span className="block text-sm text-gray-500 uppercase tracking-wide">ID</span>
                    <span className="text-lg font-mono font-bold">{selectedModelDetail.model.id}</span>
                  </div>
                  {(selectedModelDetail.model as any).price !== undefined && (
                    <div className="bg-gray-50 p-4 rounded">
                      <span className="block text-sm text-gray-500 uppercase tracking-wide">Price</span>
                      <span className="text-lg font-bold text-green-600">${(selectedModelDetail.model as any).price.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-10">
                {Object.entries(selectedModelDetail.associations).map(([type, items]) => {
                  if (!items || items.length === 0 || type === ModelType.IMAGE) return null;
                  return (
                    <div key={type}>
                      <h3 className="text-xl font-bold mb-4 border-b pb-2">Associated {modelNameToDisplayName[type as ModelType]}s</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => navigate(`/admin?type=${type}&id=${item.id}`)}
                            className="border rounded p-4 hover:border-blue-400 cursor-pointer transition-colors"
                          >
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Admin = () => {
  return (
    <AdminCacheProvider>
      <Header />
      <Main>
        <AdminContent />
      </Main>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </AdminCacheProvider>
  );
};
