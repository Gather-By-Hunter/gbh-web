import { RentalModel } from "@model/index.ts";
import { ModelType } from "@repos/rental/ModelRepo.ts";
import { Id } from "@model/Id.ts";

export interface CreateField {
  name: string;
  displayName: string;
  type: "string" | "number" | "text";
  required?: boolean;
}

export interface CreatePresenter {
  getFields(): CreateField[];
  getAllowedAssociations(): ModelType[];
  create(data: any, associations: Partial<Record<ModelType, Id[]>>): Promise<void>;
  validate(data: any): string | null;
}
