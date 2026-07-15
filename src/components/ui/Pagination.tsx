"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { ICON_SIZE } from "@/lib/design-tokens";

export interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const pageWindow = (page: number, pages: number): (number | "ellipsis")[] => {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - (nums[i - 1] as number) > 1) result.push("ellipsis");
    result.push(n);
  });
  return result;
};

/** Numbered pagination — every list endpoint in the backend already returns `{page, pages, total}`, this consumes that shape directly. */
export function Pagination({ page, pages, onPageChange, className }: PaginationProps) {
  if (pages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <Button intent="ghost" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
        <ChevronLeft size={ICON_SIZE.md} />
      </Button>
      {pageWindow(page, pages).map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-sm text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={cn(
              "h-9 w-9 rounded-lg text-sm font-medium transition-colors duration-(--duration-fast) ease-(--ease-out)",
              p === page ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            {p}
          </button>
        )
      )}
      <Button intent="ghost" size="icon" disabled={page >= pages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
        <ChevronRight size={ICON_SIZE.md} />
      </Button>
    </nav>
  );
}
