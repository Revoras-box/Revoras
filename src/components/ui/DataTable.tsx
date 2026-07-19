import { cn } from "@/lib/utils";
import { ListItemSkeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  /**
   * Omit this column from the mobile card. Use for columns that only make sense
   * beside their neighbours — a card shows one field per line, so a low-signal
   * column costs a whole row of vertical space there.
   */
  hideOnMobile?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Stable row identity for the `key` prop — falls back to array index if omitted. */
  rowKey?: (row: T, index: number) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

/**
 * Generic tabular data display — admin queues, business bookings/team
 * lists, analytics breakdowns. Takes column definitions and row data only;
 * it has no idea what a "business" or "booking" is.
 *
 * Below `md` it renders as cards rather than a table. A table narrower than its
 * content can only scroll sideways, and horizontal scroll inside a vertically
 * scrolling page is close to undiscoverable on a phone — columns past the second
 * were effectively invisible. Business owners here work from a phone, so the
 * cards are the primary layout, not a degraded one.
 *
 * The first column is treated as the row's identity (every caller puts the
 * name/customer/service there) and becomes the card header; the rest render as
 * label-value pairs. Callers that need a different split mark low-signal columns
 * `hideOnMobile`.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={cn("rounded-2xl border border-border divide-y divide-border", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-2xl border border-border", className)}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  // Click and keyboard activation are identical for a table row and a card, so
  // they're derived once rather than written twice and drifting apart.
  const interactionProps = (row: T) =>
    onRowClick
      ? {
          onClick: () => onRowClick(row),
          tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRowClick(row);
            }
          },
        }
      : {};

  const [identity, ...rest] = columns;
  const cardColumns = rest.filter((col) => !col.hideOnMobile);

  return (
    <>
      {/* Mobile: one card per row. */}
      <div className={cn("flex flex-col gap-3 md:hidden", className)}>
        {data.map((row, i) => (
          <div
            key={rowKey ? rowKey(row, i) : i}
            {...interactionProps(row)}
            role={onRowClick ? "button" : undefined}
            className={cn(
              "rounded-2xl border border-border p-4",
              onRowClick &&
                "cursor-pointer transition-colors duration-(--duration-fast) ease-(--ease-out) hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
            )}
          >
            {identity ? <div className="text-on-surface">{identity.render(row)}</div> : null}
            {cardColumns.length > 0 ? (
              <dl className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                {cardColumns.map((col) => (
                  <div key={col.key} className="flex items-center justify-between gap-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">{col.header}</dt>
                    <dd className="min-w-0 text-right text-sm text-on-surface">{col.render(row)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ))}
      </div>

      {/* Tablet and up: the real table. */}
      <div className={cn("hidden overflow-x-auto rounded-2xl border border-border md:block", className)}>
      <table className="w-full text-sm min-w-max">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted",
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, i) => (
            <tr
              key={rowKey ? rowKey(row, i) : i}
              {...interactionProps(row)}
              className={cn(
                onRowClick &&
                  "cursor-pointer hover:bg-surface-container-low transition-colors duration-(--duration-fast) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-on-surface",
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left",
                    col.className
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
