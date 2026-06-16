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

export class ProductCreatePresenter implements CreatePresenter {
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
      { name: "price", displayName: "Price", type: "number", required: true },
      {
        name: "totalQuantity",
        displayName: "Quantity",
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
    if (typeof data.price !== "number" || data.price < 0)
      return "Valid price is required";
    if (typeof data.totalQuantity !== "number" || data.totalQuantity < 0)
      return "Valid quantity is required";
    return null;
  }

  async create(
    data: CreateFormData,
    associations: Partial<Record<ModelType, Id[]>>,
  ): Promise<void> {
    const product = {
      name: getRequiredString(data, "name"),
      description: getRequiredString(data, "description"),
      price: getRequiredNumber(data, "price"),
      totalQuantity: getRequiredNumber(data, "totalQuantity"),
      tags: getTags(data),
    };

    const { id: productId } =
      await this.services.productService.create(product);

    const media = associations[ModelType.MEDIA];
    if (media) {
      for (const imageId of media) {
        await this.services.productService.addMedia(productId, imageId);
      }
    }
  }
}
