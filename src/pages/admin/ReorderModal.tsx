import { useState, useEffect } from "react";
import { HomeMediaDisplay, MediaVersion } from "@model/index.ts";
import { Id } from "@model/Id.ts";
import { LazyMedia } from "@components/media/LazyMedia.tsx";
import { GripVertical, X, Save } from "lucide-react";
import { adminStyles } from "./adminStyles.ts";

interface ReorderModalProps {
  images: HomeMediaDisplay[];
  mediaVersions: Record<number, MediaVersion[]>;
  onClose: () => void;
  onSave: (ids: Id[]) => Promise<void>;
}

export const ReorderModal = ({ images, mediaVersions, onClose, onSave }: ReorderModalProps) => {
  const [items, setItems] = useState<HomeMediaDisplay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems([...images]);
  }, [images]);

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(items.map(i => i.id));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gbh-black/65 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-gbh-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-montserrat-light">
        <header className="p-6 border-b border-gbh-gold/25 flex justify-between items-center bg-gbh-cream">
          <div>
            <h2 className={`${adminStyles.heading} text-4xl`}>Reorder Home Media</h2>
            <p className="text-sm text-gbh-black/60">Drag or use arrows to change the display sequence</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gbh-gold/15 rounded-full text-gbh-black"><X /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className="flex items-center gap-4 p-3 bg-gbh-white border border-gbh-gold/25 rounded-md shadow-sm hover:border-gbh-gold transition-colors group"
            >
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="p-1 hover:bg-gbh-cream rounded disabled:opacity-30"
                >
                  ▲
                </button>
                <button 
                   onClick={() => moveItem(index, "down")}
                   disabled={index === items.length - 1}
                   className="p-1 hover:bg-gbh-cream rounded disabled:opacity-30"
                >
                  ▼
                </button>
              </div>

              <div className="w-20 h-20 rounded-md overflow-hidden bg-gbh-cream flex-shrink-0 border border-gbh-gold/20">
                {item.media && (
                  <LazyMedia 
                    media={item.media} 
                    versions={mediaVersions[item.mediaMetadataId]}
                    preferredResolution="thumbnail"
                    className="w-full h-full"
                  />
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-gbh-black">{item.media?.name}</h4>
                <p className="text-xs text-gbh-black/45 font-mono">ID: {item.id}</p>
              </div>

              <GripVertical className="text-gbh-gold/50 group-hover:text-gbh-gold cursor-grab" />
            </div>
          ))}
        </div>

        <footer className="p-6 border-t border-gbh-gold/25 bg-gbh-cream flex justify-end gap-3">
          <button onClick={onClose} className={adminStyles.secondaryButton}>
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className={`${adminStyles.primaryButton} flex items-center gap-2`}
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Order"}
          </button>
        </footer>
      </div>
    </div>
  );
};
