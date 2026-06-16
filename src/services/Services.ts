import { Repos } from "@repos/Repos.ts";
import { PersistanceStore } from "@stores/PersistanceStore.ts";
import { AdminAuthService } from "./AdminAuthService.ts";
import { AuthService } from "./AuthService.ts";
import {
  CategoryService,
  CollectionService,
  EventTypeService,
  MediaService,
  PackageService,
  ProductService,
  HomeService,
} from "./rental/index.ts";

export interface Services {
  adminAuthService: AdminAuthService;
  authService: AuthService;
  categoryService: CategoryService;
  collectionService: CollectionService;
  eventTypeService: EventTypeService;
  mediaService: MediaService;
  packageService: PackageService;
  productService: ProductService;
  homeService: HomeService;
}

export const createServices = (
  repos: Repos,
  persistanceStore: PersistanceStore,
): Services => {
  const mediaService = new MediaService(repos.mediaRepo);

  return {
    adminAuthService: new AdminAuthService(repos.adminAuthRepo),
    authService: new AuthService(persistanceStore, repos.authRepo),
    categoryService: new CategoryService(repos.categoryRepo),
    collectionService: new CollectionService(repos.collectionRepo),
    eventTypeService: new EventTypeService(repos.eventTypeRepo),
    mediaService,
    packageService: new PackageService(repos.packageRepo),
    productService: new ProductService(repos.productRepo),
    homeService: new HomeService(repos.homeRepo, mediaService),
  };
};
