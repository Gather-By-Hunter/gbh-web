import type { AuthRepo } from "./auth/index.ts";
import type {
  CategoryRepo,
  CollectionRepo,
  EventTypeRepo,
  PackageRepo,
  ProductRepo,
} from "./rental/index.ts";

export interface Repos {
  auth: AuthRepo;
  eventType: EventTypeRepo;
  collection: CollectionRepo;
  category: CategoryRepo;
  package: PackageRepo;
  product: ProductRepo;
}
