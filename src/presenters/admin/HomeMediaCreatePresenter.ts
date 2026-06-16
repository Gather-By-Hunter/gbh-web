import {
  CreatePresenter,
  CreateField,
  CreateFormData,
  getRequiredNumber,
} from "./CreatePresenter.ts";
import { Services } from "@services/Services.ts";
import { ModelType } from "@model/index.ts";
import { Id } from "@model/Id.ts";

export class HomeMediaCreatePresenter implements CreatePresenter {
  constructor(private services: Services) {}

  getFields(): CreateField[] {
    return [
      {
        name: "mediaMetadataId",
        displayName: "Media ID (from library)",
        type: "number",
        required: true,
      },
      {
        name: "displayOrder",
        displayName: "Display Order (optional)",
        type: "number",
        required: false,
      },
    ];
  }

  getAllowedAssociations(): ModelType[] {
    return [ModelType.MEDIA]; // Allow searching the media library
  }

  validate(data: CreateFormData): string | null {
    if (!data.mediaMetadataId)
      return "A media item must be selected from the library";
    return null;
  }

  async create(
    data: CreateFormData,
    _associations: Partial<Record<ModelType, Id[]>>,
  ): Promise<void> {
    const mediaMetadataId = getRequiredNumber(data, "mediaMetadataId");
    const displayOrder = data.displayOrder;

    await this.services.homeService.addMediaToHome(
      mediaMetadataId,
      typeof displayOrder === "number" && !Number.isNaN(displayOrder)
        ? displayOrder
        : undefined,
    );
  }
}
