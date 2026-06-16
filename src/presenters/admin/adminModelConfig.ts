import { ModelType } from "@model/index.ts";
import type { Services } from "@services/Services.ts";
import type { CreatePresenter } from "./CreatePresenter.ts";
import { CategoryCreatePresenter } from "./CategoryCreatePresenter.ts";
import { CollectionCreatePresenter } from "./CollectionCreatePresenter.ts";
import { EventTypeCreatePresenter } from "./EventTypeCreatePresenter.ts";
import { HomeMediaCreatePresenter } from "./HomeMediaCreatePresenter.ts";
import { PackageCreatePresenter } from "./PackageCreatePresenter.ts";
import { ProductCreatePresenter } from "./ProductCreatePresenter.ts";

export interface AdminModelTab {
  type: ModelType;
  label: string;
}

export interface AdminModelConfig {
  type: ModelType;
  singularName: string;
  pluralName: string;
  tabLabel: string;
  pluralEndpoint: string;
  allowedAssociations: ModelType[];
  supportsMedia: boolean;
  supportsTags: boolean;
  supportsDirectCreate: boolean;
  isHomeMedia: boolean;
  createPresenter: ((services: Services) => CreatePresenter) | null;
}

export type AdminModelConfigMap = Record<ModelType, AdminModelConfig>;

export const adminModelConfig: AdminModelConfigMap = {
  [ModelType.EVENT_TYPE]: {
    type: ModelType.EVENT_TYPE,
    singularName: "Event Type",
    pluralName: "Event Types",
    tabLabel: "Event Types",
    pluralEndpoint: "event-types",
    allowedAssociations: [
      ModelType.COLLECTION,
      ModelType.CATEGORY,
      ModelType.PACKAGE,
      ModelType.PRODUCT,
      ModelType.MEDIA,
    ],
    supportsMedia: true,
    supportsTags: true,
    supportsDirectCreate: true,
    isHomeMedia: false,
    createPresenter: (services) => new EventTypeCreatePresenter(services),
  },
  [ModelType.COLLECTION]: {
    type: ModelType.COLLECTION,
    singularName: "Collection",
    pluralName: "Collections",
    tabLabel: "Collections",
    pluralEndpoint: "collections",
    allowedAssociations: [
      ModelType.CATEGORY,
      ModelType.PACKAGE,
      ModelType.PRODUCT,
      ModelType.MEDIA,
    ],
    supportsMedia: true,
    supportsTags: true,
    supportsDirectCreate: true,
    isHomeMedia: false,
    createPresenter: (services) => new CollectionCreatePresenter(services),
  },
  [ModelType.CATEGORY]: {
    type: ModelType.CATEGORY,
    singularName: "Category",
    pluralName: "Categories",
    tabLabel: "Categories",
    pluralEndpoint: "categories",
    allowedAssociations: [
      ModelType.CATEGORY,
      ModelType.PACKAGE,
      ModelType.PRODUCT,
      ModelType.MEDIA,
    ],
    supportsMedia: true,
    supportsTags: true,
    supportsDirectCreate: true,
    isHomeMedia: false,
    createPresenter: (services) => new CategoryCreatePresenter(services),
  },
  [ModelType.PACKAGE]: {
    type: ModelType.PACKAGE,
    singularName: "Package",
    pluralName: "Packages",
    tabLabel: "Packages",
    pluralEndpoint: "packages",
    allowedAssociations: [ModelType.MEDIA],
    supportsMedia: true,
    supportsTags: true,
    supportsDirectCreate: true,
    isHomeMedia: false,
    createPresenter: (services) => new PackageCreatePresenter(services),
  },
  [ModelType.PRODUCT]: {
    type: ModelType.PRODUCT,
    singularName: "Product",
    pluralName: "Products",
    tabLabel: "Products",
    pluralEndpoint: "products",
    allowedAssociations: [ModelType.MEDIA],
    supportsMedia: true,
    supportsTags: true,
    supportsDirectCreate: true,
    isHomeMedia: false,
    createPresenter: (services) => new ProductCreatePresenter(services),
  },
  [ModelType.MEDIA]: {
    type: ModelType.MEDIA,
    singularName: "Media",
    pluralName: "Media Library",
    tabLabel: "Library",
    pluralEndpoint: "media",
    allowedAssociations: [],
    supportsMedia: false,
    supportsTags: false,
    supportsDirectCreate: false,
    isHomeMedia: false,
    createPresenter: null,
  },
  [ModelType.HOME_MEDIA]: {
    type: ModelType.HOME_MEDIA,
    singularName: "Home Media",
    pluralName: "Home Screen",
    tabLabel: "Home Screen",
    pluralEndpoint: "home-media",
    allowedAssociations: [ModelType.MEDIA],
    supportsMedia: false,
    supportsTags: false,
    supportsDirectCreate: true,
    isHomeMedia: true,
    createPresenter: (services) => new HomeMediaCreatePresenter(services),
  },
};

export const adminModelTabs: AdminModelTab[] = [
  ModelType.EVENT_TYPE,
  ModelType.COLLECTION,
  ModelType.CATEGORY,
  ModelType.PACKAGE,
  ModelType.PRODUCT,
  ModelType.MEDIA,
  ModelType.HOME_MEDIA,
].map((type) => ({
  type,
  label: adminModelConfig[type].tabLabel,
}));

export const getAdminModelConfig = (type: ModelType): AdminModelConfig =>
  adminModelConfig[type];

export const getAdminModelPluralEndpoint = (type: ModelType): string =>
  getAdminModelConfig(type).pluralEndpoint;

export const getAdminModelPluralName = (type: ModelType): string =>
  getAdminModelConfig(type).pluralName;

export const getAdminModelSingularName = (type: ModelType): string =>
  getAdminModelConfig(type).singularName;

export const getAdminModelAssociationTypes = (type: ModelType): ModelType[] =>
  getAdminModelConfig(type).allowedAssociations;

export const adminModelSupportsTags = (type: ModelType): boolean =>
  getAdminModelConfig(type).supportsTags;

export const createAdminCreatePresenter = (
  type: ModelType,
  services: Services,
): CreatePresenter | null => {
  return getAdminModelConfig(type).createPresenter?.(services) ?? null;
};
