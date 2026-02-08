export const Permission = {
  COLLECTION_VIEW_ALL: "collection:view_all",
  COLLECTION_CREATE: "collection:create",
  COLLECTION_UPDATE: "collection:update",
  COLLECTION_DELETE: "collection:delete",

  COLLECTION_ADD_CATEGORY: "collection:add_category",
  COLLECTION_ADD_PACKAGE: "collection:add_package",
  COLLECTION_ADD_PRODUCT: "collection:add_product",
  COLLECITON_ADD_IMAGE: "collection:add_image",

  COLLECTION_REMOVE_CATEGORY: "collection:remove_category",
  COLLECTION_REMOVE_PACKAGE: "collection:remove_package",
  COLLECTION_REMOVE_PRODUCT: "collection:remove_product",
  COLLECTION_REMOVE_IMAGE: "collection:remove_image",

  COLLECTION_GET_CATEGORIES: "collection:get_categories",
  COLLECTION_GET_PACKAGES: "collection:get_packages",
  COLLECTION_GET_PRODUCTS: "collection:get_products",
  COLLECTION_GET_IMAGES: "collection:get_images",

  CATEGORY_VIEW_ALL: "category:view_all",
  CATEGORY_CREATE: "category:create",
  CATEGORY_UPDATE: "category:update",
  CATEGORY_DELETE: "category:delete",

  CATEGORY_ADD_SUBCATEGORY: "category:add_subcategory",
  CATEGORY_REMOVE_SUBCATEGORY: "category:remove_subcategory",

  CATEGORY_ADD_PACKAGE: "category:add_package",
  CATEGORY_ADD_PRODUCT: "category:add_product",
  CATEGORY_ADD_IMAGE: "category:add_image",

  CATEGORY_REMOVE_PACKAGE: "category:remove_package",
  CATEGORY_REMOVE_PRODUCT: "category:remove_product",
  CATEGORY_REMOVE_IMAGE: "category:remove_image",

  CATEGORY_GET_PACKAGES: "category:get_packages",
  CATEGORY_GET_PRODUCTS: "category:get_products",
  CATEGORY_GET_IMAGES: "category:get_images",

  PACKAGE_VIEW_ALL: "package:view_all",
  PACKAGE_CREATE: "package:create",
  PACKAGE_UPDATE: "package:update",
  PACKAGE_DELETE: "package:delete",

  PACKAGE_ADD_PRODUCT: "package:add_product",
  PACKAGE_ADD_IMAGE: "package:add_image",

  PACKAGE_REMOVE_PRODUCT: "package:remove_product",
  PACKAGE_REMOVE_IMAGE: "package:remove_image",

  PACKAGE_GET_PRODUCTS: "package:get_products",
  PACKAGE_GET_IMAGES: "package:get_images",

  PRODUCT_VIEW_ALL: "product:view_all",
  PRODUCT_CREATE: "product:create",
  PRODUCT_UPDATE: "product:update",
  PRODUCT_DELETE: "product:delete",

  PRODUCT_ADD_IMAGE: "product:add_image",

  PRODUCT_REMOVE_IMAGE: "product:remove_image",

  PRODUCT_GET_IMAGES: "product:get_images",

  IMAGE_VIEW_ALL: "image:view_all",
  IMAGE_CREATE: "image:create",
  IMAGE_UPDATE: "image:update",
  IMAGE_DELETE: "image:delete",

  USER_DELETE: "user:delete",
  USER_UPDATE: "user:update",
  USER_VIEW_ALL: "user:view_all",
  USER_ADD_ROLE: "user:add_role",
  USER_REMOVE_ROLE: "user:remove_role",

  ROLE_VIEW_ALL: "role:view_all",

  ROLE_CREATE: "role:create",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  ROLE_GET: "role:get",
} as const;

export type PermissionName = (typeof Permission)[keyof typeof Permission];
