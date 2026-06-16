export const Permission = {
  ADMIN_DASHBOARD_VIEW: "admin_dashboard:view",
  ADMIN_CATALOG_VIEW: "admin:catalog",
  ADMIN_USERS_VIEW: "admin:users",
  ADMIN_ROLES_VIEW: "admin:roles",
  ADMIN_ORDERS_VIEW: "admin:orders",

  EVENT_TYPE_VIEW_ALL: "event_type:view_all",
  EVENT_TYPE_CREATE: "event_type:create",
  EVENT_TYPE_UPDATE: "event_type:update",
  EVENT_TYPE_DELETE: "event_type:delete",

  EVENT_TYPE_ADD_COLLECTION: "event_type:add_collection",
  EVENT_TYPE_ADD_CATEGORY: "event_type:add_category",
  EVENT_TYPE_ADD_PACKAGE: "event_type:add_package",
  EVENT_TYPE_ADD_PRODUCT: "event_type:add_product",
  EVENT_TYPE_ADD_IMAGE: "event_type:add_image",

  EVENT_TYPE_REMOVE_COLLECTION: "event_type:remove_collection",
  EVENT_TYPE_REMOVE_CATEGORY: "event_type:remove_category",
  EVENT_TYPE_REMOVE_PACKAGE: "event_type:remove_package",
  EVENT_TYPE_REMOVE_PRODUCT: "event_type:remove_product",
  EVENT_TYPE_REMOVE_IMAGE: "event_type:remove_image",

  EVENT_TYPE_GET_COLLECTIONS: "event_type:get_collections",
  EVENT_TYPE_GET_CATEGORIES: "event_type:get_categories",
  EVENT_TYPE_GET_PACKAGES: "event_type:get_packages",
  EVENT_TYPE_GET_PRODUCTS: "event_type:get_products",
  EVENT_TYPE_GET_IMAGES: "event_type:get_images",

  COLLECTION_VIEW_ALL: "collection:view_all",
  COLLECTION_CREATE: "collection:create",
  COLLECTION_UPDATE: "collection:update",
  COLLECTION_DELETE: "collection:delete",

  COLLECTION_ADD_CATEGORY: "collection:add_category",
  COLLECTION_ADD_PACKAGE: "collection:add_package",
  COLLECTION_ADD_PRODUCT: "collection:add_product",
  COLLECTION_ADD_IMAGE: "collection:add_image",

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

  MEDIA_VIEW_ALL: "media:view_all",
  MEDIA_CREATE: "media:create",
  MEDIA_UPDATE: "media:update",
  MEDIA_DELETE: "media:delete",

  HOME_MEDIA_VIEW_ALL: "home_media:view_all",
  HOME_MEDIA_CREATE: "home_media:create",
  HOME_MEDIA_UPDATE: "home_media:update",
  HOME_MEDIA_DELETE: "home_media:delete",

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
