import { ModelType, RentalModel } from "@model/index.ts";
import type { AdminView } from "@presenters/AdminPresenter.ts";
import { AdminModelCache } from "./AdminModelCache.ts";

export class AdminSearchCoordinator {
  constructor(
    private readonly view: AdminView,
    private readonly cache: AdminModelCache,
  ) {}

  searchModels(type: ModelType, query: string): void {
    const normalizedQuery = query.trim().toLowerCase();
    const candidates = this.cache.valuesFor(type);
    const results: RentalModel[] = normalizedQuery
      ? candidates.filter((model) => {
          return (
            model.name.toLowerCase().includes(normalizedQuery) ||
            model.description.toLowerCase().includes(normalizedQuery)
          );
        })
      : candidates;

    this.view.setSearchResults(type, results);
  }
}
