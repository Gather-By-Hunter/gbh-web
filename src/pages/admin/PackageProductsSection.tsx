import type {
  PackageProductDisplay,
  Product,
  RentalModel,
} from "@model/index.ts";
import { adminStyles } from "./adminStyles.ts";
import type { Id } from "@model/Id.ts";

interface PackageProductsSectionProps {
  packageProducts: PackageProductDisplay[];
  searchResults: RentalModel[];
  showSearch: boolean;
  onToggleSearch: () => void;
  onSearch: (query: string) => void;
  onSetQuantity: (productId: Id, quantity: number) => Promise<void>;
  onRemove: (productId: Id) => Promise<void>;
}

const parseQuantity = (value: string): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

export const PackageProductsSection = ({
  packageProducts,
  searchResults,
  showSearch,
  onToggleSearch,
  onSearch,
  onSetQuantity,
  onRemove,
}: PackageProductsSectionProps) => {
  const packageProductIds = new Set(
    packageProducts.map((item) => item.productId),
  );
  const availableSearchResults = searchResults.filter(
    (item): item is Product => !packageProductIds.has(item.id),
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b border-gbh-gold/25 pb-2">
        <h3 className={`${adminStyles.heading} text-3xl`}>Package Products</h3>
        <button onClick={onToggleSearch} className={adminStyles.subtleButton}>
          {showSearch ? "Close Search" : "+ Add Product"}
        </button>
      </div>

      {showSearch && (
        <div className={`${adminStyles.insetPanel} mb-6 p-4`}>
          <input
            type="text"
            placeholder="Search products..."
            className={`${adminStyles.input} mb-3`}
            onChange={(event) => onSearch(event.target.value)}
          />
          <div className="max-h-48 overflow-y-auto divide-y divide-gbh-gold/15 bg-gbh-white border border-gbh-gold/25 rounded-md">
            {availableSearchResults.map((product) => (
              <div
                key={product.id}
                className="p-2 flex items-center justify-between hover:bg-gbh-cream/70"
              >
                <div>
                  <span className="block text-sm font-medium text-gbh-black">
                    {product.name}
                  </span>
                  <span className="block text-xs text-gbh-black/55">
                    ${product.price.toFixed(2)} · {product.totalQuantity} total
                  </span>
                </div>
                <button
                  onClick={() => onSetQuantity(product.id, 1)}
                  className="text-gbh-green text-sm font-bold hover:text-gbh-gold"
                >
                  Add
                </button>
              </div>
            ))}
            {availableSearchResults.length === 0 && (
              <div className="p-3 text-center text-sm text-gbh-black/45">
                No products found
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packageProducts.map((item) => (
          <div
            key={item.id}
            className="border border-gbh-gold/25 rounded-md p-4 bg-gbh-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-gbh-black">
                  {item.product.name}
                </h4>
                <p className="text-sm text-gbh-black/55 line-clamp-1">
                  {item.product.description}
                </p>
                <p className="mt-2 text-sm text-gbh-green font-bold">
                  ${item.product.price.toFixed(2)} each
                </p>
              </div>
              <button
                onClick={() => onRemove(item.productId)}
                className={adminStyles.dangerButton}
              >
                Remove
              </button>
            </div>

            <div className="mt-4">
              <label className={adminStyles.label}>Quantity in Package</label>
              <input
                type="number"
                min="1"
                step="1"
                className={adminStyles.input}
                defaultValue={item.quantity}
                onBlur={(event) =>
                  onSetQuantity(
                    item.productId,
                    parseQuantity(event.target.value),
                  )
                }
              />
            </div>
          </div>
        ))}

        {packageProducts.length === 0 && (
          <div className="col-span-full py-4 text-center text-gbh-black/45 italic bg-gbh-cream/50 rounded-md border border-dashed border-gbh-gold/30">
            No products in this package
          </div>
        )}
      </div>
    </div>
  );
};
