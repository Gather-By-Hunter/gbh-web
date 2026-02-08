import {
  AuthService,
  CategoryService,
  CollectionService,
  EventTypeService,
  PackageService,
  ProductService,
} from "./index.ts";

export interface Services {
  authService: AuthService;
  eventTypeService: EventTypeService;
  collectionService: CollectionService;
  categoryService: CategoryService;
  packageService: PackageService;
  productService: ProductService;
}
