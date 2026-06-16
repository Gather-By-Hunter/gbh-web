import {
  MediaMetadata,
  ModelType,
  Package,
  Product,
  RentalModelUnion,
} from "@model/index.ts";
import { ObjectPositionSelector } from "./ObjectPositionSelector.tsx";
import { adminStyles } from "./adminStyles.ts";
import { TagEditor } from "./TagEditor.tsx";
import { adminModelSupportsTags } from "@presenters/admin/adminModelConfig.ts";

interface EditableModelFieldsProps {
  editData: RentalModelUnion;
  onChange: (model: RentalModelUnion) => void;
}

const parseNumberInput = (value: string): number => {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const EditableModelFields = ({
  editData,
  onChange,
}: EditableModelFieldsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className={adminStyles.label}>Name</label>
        <input
          type="text"
          className={`${adminStyles.input} text-2xl font-bold`}
          value={editData.name || ""}
          onChange={(event) =>
            onChange({ ...editData, name: event.target.value })
          }
        />
      </div>
      <div>
        <label className={adminStyles.label}>Description</label>
        <textarea
          rows={4}
          className={`${adminStyles.input} text-lg`}
          value={editData.description || ""}
          onChange={(event) =>
            onChange({ ...editData, description: event.target.value })
          }
        />
      </div>
      {adminModelSupportsTags(editData.type) && (
        <div>
          <label className={adminStyles.label}>Tags</label>
          <TagEditor
            tags={editData.tags}
            editable
            onChange={(tags) => onChange({ ...editData, tags })}
          />
        </div>
      )}
      {editData.type === ModelType.PRODUCT && (
        <>
          <div>
            <label className={adminStyles.label}>Price ($)</label>
            <input
              type="number"
              step="any"
              className={`${adminStyles.input} text-lg`}
              value={(editData as Product).price || 0}
              onChange={(event) =>
                onChange({
                  ...editData,
                  price: parseNumberInput(event.target.value),
                } as Product)
              }
            />
          </div>
          <div>
            <label className={adminStyles.label}>Quantity</label>
            <input
              type="number"
              step="1"
              min="0"
              className={`${adminStyles.input} text-lg`}
              value={(editData as Product).totalQuantity || 0}
              onChange={(event) =>
                onChange({
                  ...editData,
                  totalQuantity: parseNumberInput(event.target.value),
                } as Product)
              }
            />
          </div>
        </>
      )}
      {editData.type === ModelType.PACKAGE && (
        <div>
          <label className={adminStyles.label}>Percent Discount (%)</label>
          <input
            type="number"
            step="any"
            className={`${adminStyles.input} text-lg`}
            value={(editData as Package).percentDiscount || 0}
            onChange={(event) =>
              onChange({
                ...editData,
                percentDiscount: parseNumberInput(event.target.value),
              } as Package)
            }
          />
        </div>
      )}
      {editData.type === ModelType.MEDIA && (
        <div>
          <label className={`${adminStyles.label} mb-4`}>Focal Point</label>
          <ObjectPositionSelector
            value={
              (editData as MediaMetadata).objectPosition || "center center"
            }
            onChange={(value) =>
              onChange({
                ...editData,
                objectPosition: value,
              } as MediaMetadata)
            }
          />
        </div>
      )}
    </div>
  );
};
