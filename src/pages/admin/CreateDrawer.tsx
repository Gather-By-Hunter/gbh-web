import { useState, useEffect } from "react";
import { CreatePresenter } from "@presenters/admin/CreatePresenter.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";
import { RentalModel } from "@model/index.ts";
import { Id } from "@model/Id.ts";

const modelNameToDisplayName: Record<ModelType, string> = {
  [ModelType.EVENT_TYPE]: "Event Type",
  [ModelType.COLLECTION]: "Collection",
  [ModelType.CATEGORY]: "Category",
  [ModelType.PACKAGE]: "Package",
  [ModelType.PRODUCT]: "Product",
  [ModelType.IMAGE]: "Image",
};

interface CreateDrawerProps {
  presenter: CreatePresenter;
  onClose: () => void;
  onSuccess: () => void;
  searchModels: (type: ModelType, query: string) => Promise<void>;
  searchResults: Partial<Record<ModelType, RentalModel[]>>;
  displayError: (msg: string) => void;
}

export const CreateDrawer = ({
  presenter,
  onClose,
  onSuccess,
  searchModels,
  searchResults,
  displayError,
}: CreateDrawerProps) => {
  const [formData, setFormData] = useState<any>({});
  const [selectedAssociations, setSelectedAssociations] = useState<Partial<Record<ModelType, RentalModel[]>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialData: any = {};
    presenter.getFields().forEach((f) => {
      initialData[f.name] = f.type === "number" ? 0 : "";
    });
    setFormData(initialData);
  }, [presenter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = presenter.validate(formData);
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

      await presenter.create(formData, associations);
      onSuccess();
    } catch (e: any) {
      displayError(e.message || "Failed to create model");
    } finally {
      setLoading(false);
    }
  };

  const toggleAssociation = (type: ModelType, model: RentalModel) => {
    setSelectedAssociations((prev) => {
      const currentList = prev[type] || [];
      const isSelected = currentList.some((m) => m.id === model.id);
      if (isSelected) {
        return { ...prev, [type]: currentList.filter((m) => m.id !== model.id) };
      } else {
        return { ...prev, [type]: [...currentList, model] };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <header className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold">Create New</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-2xl">×</button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {presenter.getFields().map((field) => (
              <div key={field.name} className={field.type === "text" ? "md:col-span-2" : ""}>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {field.displayName} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "text" ? (
                  <textarea
                    required={field.required}
                    rows={3}
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData[field.name] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  />
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    step={field.type === "number" ? "any" : undefined}
                    required={field.required}
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData[field.name] ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.name]: field.type === "number" ? parseFloat(e.target.value) : e.target.value,
                      })
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <hr className="my-8" />

          <div className="space-y-10">
            {presenter.getAllowedAssociations().map((type) => (
              <div key={type} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-3">Search {modelNameToDisplayName[type]}s</h3>
                  <input
                    type="text"
                    placeholder={`Search ${modelNameToDisplayName[type]}s by name...`}
                    className="w-full border p-2 rounded mb-4"
                    onChange={(e) => searchModels(type, e.target.value)}
                  />
                  <div className="max-h-64 overflow-y-auto border rounded divide-y bg-gray-50">
                    {searchResults[type]?.map((item) => (
                      <div key={item.id} className="p-3 flex items-center gap-3 hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          className="h-5 w-5 cursor-pointer"
                          checked={selectedAssociations[type]?.some((m) => m.id === item.id) || false}
                          onChange={() => toggleAssociation(type, item)}
                        />
                        <div className="flex-1">
                          <div className="font-bold">{item.name}</div>
                          <div className="text-xs text-gray-500 truncate">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-bold mb-3 text-blue-800">Selected {modelNameToDisplayName[type]}s</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssociations[type]?.map((item) => (
                      <div key={item.id} className="bg-white border border-blue-200 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                        <span className="text-sm">{item.name}</span>
                        <button type="button" onClick={() => toggleAssociation(type, item)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 sticky bottom-0 bg-white py-6 border-t flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-3 border rounded font-bold hover:bg-gray-50">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
