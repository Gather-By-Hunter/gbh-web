import { HttpCommunicator } from "@api/HttpCommunicator.ts";
import {
  AuthRepo,
  CategoryRepo,
  CollectionRepo,
  EventTypeRepo,
  PackageRepo,
  ProductRepo,
} from "@repos/index.ts";
import { Repos } from "@repos/Repos.ts";
import {
  AuthService,
  EventTypeService,
  CollectionService,
  CategoryService,
  PackageService,
  ProductService,
} from "@services/index.ts";
import { Services } from "@services/Services.ts";
import { HomeStore } from "@stores/home/HomeStore.ts";
import { PersistanceStore } from "@stores/PersistanceStore.ts";
import { RentalStore } from "@stores/rental/RentalStore.ts";
import { Stores } from "@stores/Stores.ts";

// @ts-ignore
const ASSET_BUCKET_URL = import.meta.env.VITE_ASSETS_BUCKET_URL;

// @ts-ignore
console.log(import.meta.env);

export interface GbhContext {
  stores: Stores;
  repos: Repos;
  services: Services;
}

export class ContextFactory {
  private static _instance: ContextFactory | undefined;

  private _context: GbhContext;

  constructor() {
    // @ts-ignore
    const baseUrl: string = import.meta.env.VITE_API_BASE_URL;

    const stores: Stores = {
      persistance: new PersistanceStore(),
      rental: new RentalStore([], [], [], [], {}, {}, {}, {}),
      home: new HomeStore([
        {
          id: 1,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_9338.jpg`,
          alt: "",
          objectPosition: "center 75%",
        },
        {
          id: 2,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_9341.jpg`,
          alt: "",
          objectPosition: "center 80%",
        },
        {
          id: 4,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_9514.jpg`,
          alt: "",
          objectPosition: "center 75%",
        },
        {
          id: 5,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_9525.jpg`,
          alt: "",
          objectPosition: "center 50%",
        },
        {
          id: 6,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1539.jpeg`,
          alt: "",
          objectPosition: "center 70%",
        },
        {
          id: 7,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1540.jpeg`,
          alt: "",
          objectPosition: "center 50%",
        },
        {
          id: 8,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1545.jpeg`,
          alt: "",
          objectPosition: "center 50%",
        },
        {
          id: 9,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1546.jpeg`,
          alt: "",
          objectPosition: "center 50%",
        },
        {
          id: 10,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1549.jpeg`,
          alt: "",
          objectPosition: "center 40%",
        },
        {
          id: 11,
          url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1551.jpeg`,
          alt: "",
          objectPosition: "center 50%",
        },
      ]),
    };

    const httpCommunicator = new HttpCommunicator(baseUrl, stores.persistance);

    const repos: Repos = {
      auth: new AuthRepo(httpCommunicator),
      eventType: new EventTypeRepo(httpCommunicator),
      collection: new CollectionRepo(httpCommunicator),
      category: new CategoryRepo(httpCommunicator),
      package: new PackageRepo(httpCommunicator),
      product: new ProductRepo(httpCommunicator),
    };

    const services: Services = {
      authService: new AuthService(stores.persistance, repos.auth),
      eventTypeService: new EventTypeService(repos.eventType),
      collectionService: new CollectionService(repos.collection),
      categoryService: new CategoryService(repos.category),
      packageService: new PackageService(repos.package),
      productService: new ProductService(repos.product),
    };

    this._context = {
      stores,
      repos,
      services,
    };
  }

  private static get instance(): ContextFactory {
    if (!ContextFactory._instance) {
      ContextFactory._instance = new ContextFactory();
    }
    return ContextFactory._instance;
  }

  public static context() {
    return ContextFactory.instance._context;
  }

  public static stores() {
    return ContextFactory.instance._context.stores;
  }

  public static services() {
    return ContextFactory.instance._context.services;
  }
}
