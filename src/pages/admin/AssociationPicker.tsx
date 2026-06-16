import { ModelType, RentalModel } from "@model/index.ts";
import { getAdminModelSingularName } from "@presenters/admin/adminModelConfig.ts";
import { adminStyles } from "./adminStyles.ts";

interface AssociationPickerProps {
  type: ModelType;
  searchResults: RentalModel[];
  selectedItems: RentalModel[];
  isSingleSelection?: boolean;
  heading?: string;
  onSearch: (query: string) => void;
  onToggle: (model: RentalModel) => void;
  onUploadNew?: () => void;
}

export const AssociationPicker = ({
  type,
  searchResults,
  selectedItems,
  isSingleSelection = false,
  heading,
  onSearch,
  onToggle,
  onUploadNew,
}: AssociationPickerProps) => {
  const singularName = getAdminModelSingularName(type);

  return (
    <div className="font-montserrat-light">
      <div className="flex justify-between items-center mb-3">
        <h3 className={`${adminStyles.heading} text-2xl`}>
          {heading || `Search ${singularName}s`}
        </h3>
        {onUploadNew && (
          <button
            type="button"
            onClick={onUploadNew}
            className={adminStyles.subtleButton}
          >
            + Upload New
          </button>
        )}
      </div>
      <input
        type="text"
        placeholder={`Search ${singularName}s by name...`}
        className={`${adminStyles.input} mb-4`}
        onChange={(event) => onSearch(event.target.value)}
      />
      <div className="max-h-64 overflow-y-auto rounded-md border border-gbh-gold/25 divide-y divide-gbh-gold/15 bg-gbh-cream/40">
        {searchResults.map((item) => (
          <div
            key={item.id}
            className="p-3 flex items-center gap-3 hover:bg-gbh-white transition-colors cursor-pointer"
            onClick={() => onToggle(item)}
          >
            <input
              type={isSingleSelection ? "radio" : "checkbox"}
              name={isSingleSelection ? `${type}-selection` : undefined}
              className="h-5 w-5 cursor-pointer accent-gbh-green"
              checked={selectedItems.some((selected) => selected.id === item.id)}
              readOnly
            />
            <div className="flex-1">
              <div className="font-bold text-gbh-black">{item.name}</div>
              <div className="text-xs text-gbh-black/55 truncate">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
