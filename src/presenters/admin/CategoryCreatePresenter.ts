import { CreatePresenter, CreateField } from "./CreatePresenter.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";
import { Services } from "@services/Services.ts";
import { Category } from "@model/index.ts";
import { Id } from "@model/Id.ts";

export class CategoryCreatePresenter implements CreatePresenter {
  constructor(private services: Services) {}

  getFields(): CreateField[] {
    return [
      { name: "name", displayName: "Name", type: "string", required: true },
      { name: "description", displayName: "Description", type: "text", required: true },
    ];
  }

  getAllowedAssociations(): ModelType[] {
    return [ModelType.CATEGORY, ModelType.PACKAGE, ModelType.PRODUCT, ModelType.IMAGE];
  }

  validate(data: any): string | null {
    if (!data.name) return "Name is required";
    if (!data.description) return "Description is required";
    return null;
  }

  async create(data: any, associations: Partial<Record<ModelType, Id[]>>): Promise<void> {
    const category: Omit<Category, "id"> = {
      name: data.name,
      description: data.description,
    };

    const result = await this.services.categoryService.create(category);
    const categoryId = (result as any).id;

    if (associations[ModelType.CATEGORY]) {
      for (const subId of associations[ModelType.CATEGORY]!) {
        await this.services.categoryService.addSubcategory(categoryId, subId);
      }
    }

    if (associations[ModelType.PACKAGE]) {
      for (const packageId of associations[ModelType.PACKAGE]!) {
        await this.services.categoryService.addPackage(categoryId, packageId);
      }
    }

    if (associations[ModelType.PRODUCT]) {
      for (const productId of associations[ModelType.PRODUCT]!) {
        await this.services.categoryService.addProduct(categoryId, productId);
      }
    }

    if (associations[ModelType.IMAGE]) {
      for (const imageId of associations[ModelType.IMAGE]!) {
        await this.services.categoryService.addImage(categoryId, imageId);
      }
    }
  }
}
