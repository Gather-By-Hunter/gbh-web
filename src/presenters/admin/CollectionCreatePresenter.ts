import {
  CreatePresenter,
  CreateField,
  CreateFormData,
  getRequiredString,
  getTags,
} from "./CreatePresenter.ts";
import { Services } from "@services/Services.ts";
import { ModelType } from "@model/index.ts";
import { Id } from "@model/Id.ts";

export class CollectionCreatePresenter implements CreatePresenter {
  constructor(private services: Services) {}

  getFields(): CreateField[] {
    return [
      { name: "name", displayName: "Name", type: "string", required: true },
      {
        name: "description",
        displayName: "Description",
        type: "text",
        required: true,
      },
      { name: "tags", displayName: "Tags", type: "tags" },
    ];
  }

  getAllowedAssociations(): ModelType[] {
    return [
      ModelType.CATEGORY,
      ModelType.PACKAGE,
      ModelType.PRODUCT,
      ModelType.MEDIA,
    ];
  }

  validate(data: CreateFormData): string | null {
    if (!data.name) return "Name is required";
    if (!data.description) return "Description is required";
    return null;
  }

  async create(
    data: CreateFormData,
    associations: Partial<Record<ModelType, Id[]>>,
  ): Promise<void> {
    const collection = {
      name: getRequiredString(data, "name"),
      description: getRequiredString(data, "description"),
      tags: getTags(data),
    };

    const result = await this.services.collectionService.create(collection);
    const collectionId = result.id;

    const categories = associations[ModelType.CATEGORY];
    if (categories) {
      for (const catId of categories) {
        await this.services.collectionService.addCategory(collectionId, catId);
      }
    }

    const packages = associations[ModelType.PACKAGE];
    if (packages) {
      for (const pkgId of packages) {
        await this.services.collectionService.addPackage(collectionId, pkgId);
      }
    }

    const products = associations[ModelType.PRODUCT];
    if (products) {
      for (const prodId of products) {
        await this.services.collectionService.addProduct(collectionId, prodId);
      }
    }

    const media = associations[ModelType.MEDIA];
    if (media) {
      for (const imgId of media) {
        await this.services.collectionService.addMedia(collectionId, imgId);
      }
    }
  }
}
