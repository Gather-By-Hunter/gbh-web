import { AuthService } from "@services/AuthService.ts";
import {
  CategoryService,
  CollectionService,
  EventTypeService,
  PackageService,
  ProductService,
  Services,
} from "@services/index.ts";
import { ToastID } from "./types.ts";
import { HttpError } from "@api/HttpCommunicator.ts";
import { User } from "@model/index.ts";

export interface PresenterView {
  displayError: (
    error: string,
    description?: string,
    action?: {
      label: string;
      onClick: () => void;
    },
  ) => ToastID;
  displayMessage: (
    message: string,
    description?: string,
    action?: {
      label: string;
      onClick: () => void;
    },
  ) => ToastID;
  navigate: (path: string) => void;
}

export class PresenterError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class ServicePresenter<V extends PresenterView = PresenterView> {
  protected authService: AuthService;
  protected eventTypeService: EventTypeService;
  protected collectionService: CollectionService;
  protected categoryService: CategoryService;
  protected packageService: PackageService;
  protected productService: ProductService;

  constructor(
    services: Services,
    protected view: V,
  ) {
    this.authService = services.authService;
    this.eventTypeService = services.eventTypeService;
    this.collectionService = services.collectionService;
    this.categoryService = services.categoryService;
    this.packageService = services.packageService;
    this.productService = services.productService;
  }

  protected doAction<T = unknown>(action: () => T) {
    try {
      return action();
    } catch (e) {
      this.handleError(e);
    }
  }

  protected async doAsyncAction<T = unknown>(action: () => Promise<T>) {
    try {
      return await action();
    } catch (e) {
      this.handleError(e);
    }
  }

  protected handleError(e: unknown) {
    if (e instanceof PresenterError) {
      this.view.displayError(e.message);
    } else if (e instanceof HttpError) {
      this.view.displayError(e.message, e.errorType);
    } else if (e instanceof Error) {
      this.view.displayError(e.message);
    } else {
      this.view.displayError("Something went wrong, please try again", `${e}`);
    }
  }

  onMount(user: User | null) {
    if (!user) {
      this.view.displayError("You are not logged in");
      this.view.navigate("/login");
    }
  }

  onUnmount() {}
}
