export type Id = number;

export type IdLess<T extends { id: Id }> = Omit<T, "id">;
