"use client";

import { Check, AlertCircle } from "lucide-react";

export interface CompletionItem {
  label: string;
  done: boolean;
  /** Optional section key; when set with onNavigate, a missing item is clickable. */
  target?: string;
}

// Shared completion card - a bar plus an actionable checklist (not a bare %).
// The owner drawer passes live-computed items; My Profile derives items from the
// backend's profile_missing hints. Presentational only.
export function ProfileCompletionCard({
  completion,
  items,
  onNavigate,
}: {
  completion: number;
  items: CompletionItem[];
  onNavigate?: (target: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-on-surface">Profile completion</span>
        <span className="text-sm text-muted">{completion}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => {
          const clickable = !item.done && item.target && onNavigate;
          const content = (
            <span className="flex items-center gap-2 text-sm">
              {item.done ? (
                <Check size={15} className="shrink-0 text-success" />
              ) : (
                <AlertCircle size={15} className="shrink-0 text-muted" />
              )}
              <span className={item.done ? "text-muted" : "text-on-surface"}>
                {item.done ? item.label : `Add ${item.label.toLowerCase()}`}
              </span>
            </span>
          );
          return (
            <li key={item.label}>
              {clickable ? (
                <button type="button" onClick={() => onNavigate?.(item.target as string)} className="text-left hover:underline">
                  {content}
                </button>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
