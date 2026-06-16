import { ModelType } from "@model/index.ts";
import { Id } from "@model/Id.ts";

export interface CreateField {
  name: string;
  displayName: string;
  type: "string" | "number" | "text" | "tags";
  required?: boolean;
}

export type CreateFieldValue = string | number | string[];
export type CreateFormData = Partial<Record<string, CreateFieldValue>>;

export interface CreatePresenter {
  getFields(): CreateField[];
  getAllowedAssociations(): ModelType[];
  create(
    data: CreateFormData,
    associations: Partial<Record<ModelType, Id[]>>,
  ): Promise<void>;
  validate(data: CreateFormData): string | null;
}

export const getRequiredString = (
  data: CreateFormData,
  fieldName: string,
): string => {
  const value = data[fieldName];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required`);
  }

  return value.trim();
};

export const getRequiredNumber = (
  data: CreateFormData,
  fieldName: string,
): number => {
  const value = data[fieldName];
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${fieldName} is required`);
  }

  return value;
};

export const getTags = (
  data: CreateFormData,
  fieldName: string = "tags",
): string[] | undefined => {
  const value = data[fieldName];
  if (!Array.isArray(value)) return undefined;

  const tags = value.filter((tag) => tag.length > 0);
  return tags.length > 0 ? tags : undefined;
};
