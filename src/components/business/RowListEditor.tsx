"use client";

import { Input } from "@/components/ui/Input";

// Generic add/remove editor for structured string-record lists (education,
// awards). Shared by the owner Team drawer and the My Profile page. The API
// validator narrows the records.
export function RowListEditor({
  label,
  items,
  fields,
  makeEmpty,
  onChange,
}: {
  label: string;
  items: Record<string, string>[];
  fields: { key: string; placeholder: string }[];
  makeEmpty: () => Record<string, string>;
  onChange: (items: Record<string, string>[]) => void;
}) {
  const update = (i: number, key: string, value: string) => {
    const next = items.slice();
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-on-surface">{label}</span>
        <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => onChange([...items, makeEmpty()])}>
          + Add
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted">None added.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-border p-3">
              {fields.map((f) => (
                <Input key={f.key} placeholder={f.placeholder} value={item[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} />
              ))}
              <button type="button" className="self-end text-xs text-error hover:underline" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
