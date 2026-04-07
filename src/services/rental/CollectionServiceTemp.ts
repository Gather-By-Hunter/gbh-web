import { Collection } from "@model/index.ts";
import { ModelService } from "./ModelService.ts";
import { Id } from "@model/Id.ts";
import { CollectionRepo } from "@repos/index.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";

/**
 * Generic type to generate association method names and signatures.
 */
type AssociationMethods<Singular extends string, Plural extends string> = {
  [K in `add${Capitalize<Singular>}`]: (modelId: Id, assocId: Id) => Promise<any>;
} & {
  [K in `get${Capitalize<Plural>}`]: (modelId: Id) => AsyncIterableIterator<Id[]>;
} & {
  [K in `delete${Capitalize<Singular>}`]: (modelId: Id, assocId: Id) => Promise<any>;
};

/**
 * Intersection of all dynamic association methods for the Collection service.
 */
type CollectionAssociations = 
  AssociationMethods<"category", "categories"> &
  AssociationMethods<"package", "packages"> &
  AssociationMethods<"product", "products"> &
  AssociationMethods<"image", "images">;

/**
 * Interface merging allows the TypeScript compiler to recognize the dynamic methods
 * on the class instance even though they are assigned at runtime.
 */
export interface CollectionServiceTemp extends CollectionAssociations {}

export class CollectionServiceTemp extends ModelService<
  Collection,
  CollectionRepo
> {
  constructor(repo: CollectionRepo) {
    super(repo);
    this.setupAssociations();
  }

  /**
   * Dynamically populates the class instance with association methods.
   * This handles the runtime implementation, while the interface above
   * handles the type safety.
   */
  private setupAssociations() {
    const associations: Array<{ singular: string; plural: string; type: ModelType }> = [
      { singular: "category", plural: "categories", type: ModelType.CATEGORY },
      { singular: "package", plural: "packages", type: ModelType.PACKAGE },
      { singular: "product", plural: "products", type: ModelType.PRODUCT },
      { singular: "image", plural: "images", type: ModelType.IMAGE },
    ];

    for (const { singular, plural, type } of associations) {
      const capSingular = singular.charAt(0).toUpperCase() + singular.slice(1);
      const capPlural = plural.charAt(0).toUpperCase() + plural.slice(1);

      // Implement add{Model}
      (this as any)[`add${capSingular}`] = (modelId: Id, assocId: Id) =>
        this.createAssociation(modelId, assocId, type);

      // Implement get{Models}
      (this as any)[`get${capPlural}`] = (modelId: Id) =>
        this.getAssociations(modelId, type);

      // Implement delete{Model}
      (this as any)[`delete${capSingular}`] = (modelId: Id, assocId: Id) =>
        this.removeAssociation(modelId, assocId, type);
    }
  }
}
