import { CreatePresenter, CreateField } from "./CreatePresenter.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";
import { Services } from "@services/Services.ts";
import { Product } from "@model/index.ts";
import { Id } from "@model/Id.ts";

export class ProductCreatePresenter implements CreatePresenter {
  constructor(private services: Services) {}

  getFields(): CreateField[] {
    return [
      { name: "name", displayName: "Name", type: "string", required: true },
      { name: "description", displayName: "Description", type: "text", required: true },
      { name: "price", displayName: "Price ($)", type: "number", required: true },
    ];
  }

  getAllowedAssociations(): ModelType[] {
    return [ModelType.IMAGE];
  }

  validate(data: any): string | null {
    if (!data.name) return "Name is required";
    if (!data.description) return "Description is required";
    if (data.price === undefined || data.price < 0) return "Valid price is required";
    return null;
  }

  async create(data: any, associations: Partial<Record<ModelType, Id[]>>): Promise<void> {
    const product: Omit<Product, "id"> = {
      name: data.name,
      description: data.description,
      price: data.price,
    };

    const result = await this.services.productService.create(product);
    const productId = (result as any).id;

    if (associations[ModelType.IMAGE]) {
      for (const imageId of associations[ModelType.IMAGE]!) {
        await this.services.productService.addImage(productId, imageId);
      }
    }
  }
}
