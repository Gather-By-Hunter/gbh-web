import { Plus, X } from "lucide-react";
import { useState } from "react";

interface TagEditorProps {
  tags?: readonly string[];
  editable: boolean;
  compact?: boolean;
  onChange?: (tags: string[]) => void | Promise<void>;
}

const normalizeTag = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeTags = (tags: readonly string[]): string[] =>
  Array.from(new Set(tags.map(normalizeTag).filter(Boolean)));

export const TagEditor = ({
  tags = [],
  editable,
  compact = false,
  onChange,
}: TagEditorProps) => {
  const [input, setInput] = useState("");
  const normalizedTags = normalizeTags(tags);

  const commitTags = async (nextTags: readonly string[]) => {
    await onChange?.(normalizeTags(nextTags));
  };

  const addInputTags = async () => {
    const nextTags = input.split(",").map(normalizeTag).filter(Boolean);
    if (nextTags.length === 0) return;

    setInput("");
    await commitTags([...normalizedTags, ...nextTags]);
  };

  const removeTag = async (tagToRemove: string) => {
    await commitTags(normalizedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex flex-wrap gap-1.5">
        {normalizedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex max-w-full items-center gap-1 rounded-full border border-gbh-gold/30 bg-gbh-gold/10 px-2 py-0.5 text-xs font-bold text-gbh-green"
          >
            <span className="truncate">{tag}</span>
            {editable && (
              <button
                type="button"
                className="rounded-full p-0.5 text-gbh-green/65 transition hover:bg-gbh-gold/20 hover:text-gbh-green"
                onClick={() => removeTag(tag)}
                title={`Remove ${tag}`}
              >
                <X size={12} />
              </button>
            )}
          </span>
        ))}
        {normalizedTags.length === 0 && !editable && (
          <span className="text-xs italic text-gbh-black/40">No tags</span>
        )}
      </div>

      {editable && (
        <div className="flex gap-2">
          <input
            type="text"
            className={`min-w-0 flex-1 rounded-md border border-gbh-gold/30 bg-gbh-white px-2.5 py-1.5 text-sm text-gbh-black outline-none transition placeholder:text-gbh-black/40 focus:border-gbh-gold focus:ring-2 focus:ring-gbh-gold/25 ${
              compact ? "max-w-44" : ""
            }`}
            value={input}
            placeholder="Add tag"
            onChange={(event) => setInput(event.target.value)}
            onBlur={addInputTags}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addInputTags();
              }
            }}
          />
          <button
            type="button"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gbh-green text-gbh-white transition hover:bg-gbh-gold"
            onMouseDown={(event) => event.preventDefault()}
            onClick={addInputTags}
            title="Add tag"
          >
            <Plus size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
