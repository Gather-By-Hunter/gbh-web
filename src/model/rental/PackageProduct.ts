import type { Id } from "@model/Id.ts";
import type { Product } from "./Product.ts";

export interface PackageProduct {
  id: Id;
  packageId: Id;
  productId: Id;
  quantity: number;
}

export interface PackageProductDisplay extends PackageProduct {
  product: Product;
}
