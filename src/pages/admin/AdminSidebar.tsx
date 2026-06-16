import { adminModelTabs } from "@presenters/admin/adminModelConfig.ts";
import { ModelType } from "@model/index.ts";
import {
  ArrowLeft,
  Calendar,
  FolderTree,
  Home,
  Images,
  Layers,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminStyles } from "./adminStyles.ts";

interface AdminSidebarProps {
  activeTab: ModelType;
  onSelectTab: (type: ModelType) => void;
}

const tabIcons = {
  [ModelType.EVENT_TYPE]: Calendar,
  [ModelType.COLLECTION]: FolderTree,
  [ModelType.CATEGORY]: Layers,
  [ModelType.PACKAGE]: Package,
  [ModelType.PRODUCT]: ShoppingBag,
  [ModelType.MEDIA]: Images,
  [ModelType.HOME_MEDIA]: Home,
};

export const AdminSidebar = ({ activeTab, onSelectTab }: AdminSidebarProps) => {
  return (
    <aside className="w-64 bg-gbh-white text-gbh-black flex-shrink-0 flex flex-col border-r border-gbh-gold/30">
      <div className="p-4 border-b border-gbh-gold/20">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-md border border-gbh-gold/30 bg-gbh-cream px-3 py-2 text-sm font-bold text-gbh-black transition hover:border-gbh-gold hover:bg-gbh-gold/15 font-montserrat-light"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <Package className="text-gbh-green" size={28} strokeWidth={1.5} />
          <span
            className={`${adminStyles.heading} pt-1 text-3xl leading-none text-gbh-black`}
          >
            Catalog
          </span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {adminModelTabs.map((item) => {
          const Icon = tabIcons[item.type];

          return (
            <button
              key={item.type}
              onClick={() => onSelectTab(item.type)}
              className={`w-full flex items-center gap-3 px-6 py-4 transition-all duration-200 cursor-pointer font-montserrat-light ${
                activeTab === item.type
                  ? "bg-gbh-green text-gbh-white border-r-4 border-gbh-gold shadow-sm"
                  : "text-gbh-black/75 hover:text-gbh-black hover:bg-gbh-gold/15"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
