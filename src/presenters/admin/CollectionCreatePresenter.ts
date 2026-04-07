import { CreatePresenter, CreateField } from "./CreatePresenter.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";
import { Services } from "@services/Services.ts";
import { Collection } from "@model/index.ts";
import { Id } from "@model/Id.ts";

export class CollectionCreatePresenter implements CreatePresenter {
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
    const collection: Omit<Collection, "id"> = {
      name: data.name,
      description: data.description,
    };

    const result = await this.services.collectionService.create(collection);
    const collectionId = (result as any).id;

    if (associations[ModelType.CATEGORY]) {
      for (const catId of associations[ModelType.CATEGORY]!) {
        await this.services.collectionService.addCategory(collectionId, catId);
      }
    }

    if (associations[ModelType.PACKAGE]) {
      for (const pkgId of associations[ModelType.PACKAGE]!) {
        await this.services.collectionService.addPackage(collectionId, pkgId);
      }
    }

    if (associations[ModelType.PRODUCT]) {
      for (const prodId of associations[ModelType.PRODUCT]!) {
        await this.services.collectionService.addProduct(collectionId, prodId);
      }
    }

    if (associations[ModelType.IMAGE]) {
      for (const imgId of associations[ModelType.IMAGE]!) {
        await this.services.collectionService.addImage(collectionId, imgId);
      }
    }
  }
}
