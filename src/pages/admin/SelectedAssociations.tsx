import { ModelType, RentalModel } from "@model/index.ts";
import { getAdminModelSingularName } from "@presenters/admin/adminModelConfig.ts";
import { adminStyles } from "./adminStyles.ts";

interface SelectedAssociationsProps {
  type: ModelType;
  selectedItems: RentalModel[];
  isSingleSelection?: boolean;
  onRemove: (model: RentalModel) => void;
}

export const SelectedAssociations = ({
  type,
  selectedItems,
  isSingleSelection = false,
  onRemove,
}: SelectedAssociationsProps) => {
  return (
    <div className={`${adminStyles.insetPanel} p-4 h-fit font-montserrat-light`}>
      <h3 className={`${adminStyles.heading} text-2xl mb-3`}>
        {isSingleSelection
          ? `Selected ${getAdminModelSingularName(type)}`
          : `Selected ${getAdminModelSingularName(type)}s`}
      </h3>
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="bg-gbh-white border border-gbh-gold/30 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm"
          >
            <span className="text-sm font-bold text-gbh-black">{item.name}</span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(item);
              }}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              ×
            </button>
          </div>
        ))}
        {selectedItems.length === 0 && (
          <span className="text-sm text-gbh-black/45 italic">
            Nothing selected
          </span>
        )}
      </div>
    </div>
  );
};
