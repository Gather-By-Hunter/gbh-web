import { ModelType } from "@model/index.ts";
import { getAdminModelPluralName } from "@presenters/admin/adminModelConfig.ts";
import { ListOrdered, Plus, Search } from "lucide-react";
import { adminStyles } from "./adminStyles.ts";

interface AdminToolbarProps {
  activeTab: ModelType;
  searchQuery: string;
  showReorder: boolean;
  onSearch: (query: string) => void;
  onCreate: () => void;
  onReorder: () => void;
}

export const AdminToolbar = ({
  activeTab,
  searchQuery,
  showReorder,
  onSearch,
  onCreate,
  onReorder,
}: AdminToolbarProps) => {
  return (
    <header className="bg-gbh-cream border-b border-gbh-gold/25 p-6 flex justify-between items-center shadow-sm z-10">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gbh-gold"
            size={18}
          />
          <input
            type="text"
            placeholder={`Search ${getAdminModelPluralName(activeTab)}...`}
            value={searchQuery}
            onChange={(event) => onSearch(event.target.value)}
            className={`${adminStyles.input} pl-10`}
          />
        </div>
      </div>

      <div className="flex gap-3">
        {showReorder && (
          <button
            onClick={onReorder}
            className={`${adminStyles.secondaryButton} flex items-center gap-2 cursor-pointer`}
          >
            <ListOrdered size={18} />
            Reorder
          </button>
        )}
        <button
          onClick={onCreate}
          className={`${adminStyles.primaryButton} flex items-center gap-2 cursor-pointer`}
        >
          <Plus size={18} />
          {activeTab === ModelType.HOME_MEDIA
            ? "Add to Home"
            : activeTab === ModelType.MEDIA
              ? "Upload Media"
              : "Create New"}
        </button>
      </div>
    </header>
  );
};
