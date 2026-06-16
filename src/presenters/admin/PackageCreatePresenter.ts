import {
  CreatePresenter,
  CreateField,
  CreateFormData,
  getTags,
  getRequiredNumber,
  getRequiredString,
} from "./CreatePresenter.ts";
import { Services } from "@services/Services.ts";
import { ModelType } from "@model/index.ts";
import { Id } from "@model/Id.ts";

export class PackageCreatePresenter implements CreatePresenter {
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
      {
        name: "percentDiscount",
        displayName: "Percent Discount (%)",
        type: "number",
        required: true,
      },
      { name: "tags", displayName: "Tags", type: "tags" },
    ];
  }

  getAllowedAssociations(): ModelType[] {
    return [ModelType.MEDIA];
  }

  validate(data: CreateFormData): string | null {
    if (!data.name) return "Name is required";
    if (!data.description) return "Description is required";
    if (
      typeof data.percentDiscount !== "number" ||
      data.percentDiscount < 0 ||
      data.percentDiscount > 100
    ) {
      return "Valid percent discount (0-100) is required";
    }
    return null;
  }

  async create(
    data: CreateFormData,
    associations: Partial<Record<ModelType, Id[]>>,
  ): Promise<void> {
    const pkg = {
      name: getRequiredString(data, "name"),
      description: getRequiredString(data, "description"),
      percentDiscount: getRequiredNumber(data, "percentDiscount"),
      tags: getTags(data),
    };

    const result = await this.services.packageService.create(pkg);
    const packageId = result.id;

    const media = associations[ModelType.MEDIA];
    if (media) {
      for (const imageId of media) {
        await this.services.packageService.addMedia(packageId, imageId);
      }
    }
  }
}
