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

export class EventTypeCreatePresenter implements CreatePresenter {
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
      ModelType.COLLECTION,
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
    const eventType = {
      name: getRequiredString(data, "name"),
      description: getRequiredString(data, "description"),
      tags: getTags(data),
    };

    const result = await this.services.eventTypeService.create(eventType);
    const eventTypeId = result.id;

    const collections = associations[ModelType.COLLECTION];
    if (collections) {
      for (const collId of collections) {
        await this.services.eventTypeService.addCollection(eventTypeId, collId);
      }
    }

    const categories = associations[ModelType.CATEGORY];
    if (categories) {
      for (const catId of categories) {
        await this.services.eventTypeService.addCategory(eventTypeId, catId);
      }
    }

    const packages = associations[ModelType.PACKAGE];
    if (packages) {
      for (const pkgId of packages) {
        await this.services.eventTypeService.addPackage(eventTypeId, pkgId);
      }
    }

    const products = associations[ModelType.PRODUCT];
    if (products) {
      for (const prodId of products) {
        await this.services.eventTypeService.addProduct(eventTypeId, prodId);
      }
    }

    const media = associations[ModelType.MEDIA];
    if (media) {
      for (const imgId of media) {
        await this.services.eventTypeService.addMedia(eventTypeId, imgId);
      }
    }
  }
}
