import { CreatePresenter, CreateField } from "./CreatePresenter.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";
import { Services } from "@services/Services.ts";
import { Package } from "@model/index.ts";
import { Id } from "@model/Id.ts";

export class PackageCreatePresenter implements CreatePresenter {
  constructor(private services: Services) {}

  getFields(): CreateField[] {
    return [
      { name: "name", displayName: "Name", type: "string", required: true },
      { name: "description", displayName: "Description", type: "text", required: true },
      { name: "percentDiscount", displayName: "Percent Discount (%)", type: "number", required: true },
    ];
  }

  getAllowedAssociations(): ModelType[] {
    return [ModelType.PRODUCT, ModelType.IMAGE];
  }

  validate(data: any): string | null {
    if (!data.name) return "Name is required";
    if (!data.description) return "Description is required";
    if (data.percentDiscount === undefined || data.percentDiscount < 0 || data.percentDiscount > 100) {
      return "Valid percent discount (0-100) is required";
    }
    return null;
  }

  async create(data: any, associations: Partial<Record<ModelType, Id[]>>): Promise<void> {
    const pkg: Omit<Package, "id"> = {
      name: data.name,
      description: data.description,
      percentDiscount: data.percentDiscount,
    };

    const result = await this.services.packageService.create(pkg);
    const packageId = (result as any).id;

    if (associations[ModelType.PRODUCT]) {
      for (const productId of associations[ModelType.PRODUCT]!) {
        await this.services.packageService.addProduct(packageId, productId);
      }
    }

    if (associations[ModelType.IMAGE]) {
      for (const imageId of associations[ModelType.IMAGE]!) {
        await this.services.packageService.addImage(packageId, imageId);
      }
    }
  }
}
