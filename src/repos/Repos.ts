import { HttpCommunicator } from "@api/HttpCommunicator.ts";
import { AdminAuthRepo } from "./auth/AdminAuthRepo.ts";
import { AuthRepo } from "./auth/AuthRepo.ts";
import {
  CategoryRepo,
  CollectionRepo,
  EventTypeRepo,
  MediaRepo,
  PackageRepo,
  ProductRepo,
  HomeRepo,
} from "./rental/index.ts";

export interface Repos {
  adminAuthRepo: AdminAuthRepo;
  authRepo: AuthRepo;
  categoryRepo: CategoryRepo;
  collectionRepo: CollectionRepo;
  eventTypeRepo: EventTypeRepo;
  mediaRepo: MediaRepo;
  packageRepo: PackageRepo;
  productRepo: ProductRepo;
  homeRepo: HomeRepo;
}

export const createRepos = (communicator: HttpCommunicator): Repos => {
  return {
    adminAuthRepo: new AdminAuthRepo(communicator),
    authRepo: new AuthRepo(communicator),
    categoryRepo: new CategoryRepo(communicator),
    collectionRepo: new CollectionRepo(communicator),
    eventTypeRepo: new EventTypeRepo(communicator),
    mediaRepo: new MediaRepo(communicator),
    packageRepo: new PackageRepo(communicator),
    productRepo: new ProductRepo(communicator),
    homeRepo: new HomeRepo(communicator),
  };
};
