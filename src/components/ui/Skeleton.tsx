import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-surface-container-high", className)} {...props} />;
}

/** A row shaped like `ListItem` — use as the loading state for any list this component renders. */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

/** A tile shaped like `Card` — use as the loading state for business/service/professional card grids. */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-4 flex flex-col gap-3">
      <Skeleton className="h-28 w-full rounded-lg" />
      <Skeleton className="h-3.5 w-3/5" />
      <Skeleton className="h-3 w-2/5" />
    </div>
  );
}
