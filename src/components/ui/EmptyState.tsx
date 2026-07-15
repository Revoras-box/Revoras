import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** One forward action — "Book your first appointment", "Add a service". Never leave an empty state a dead end. */
  action?: React.ReactNode;
}

export function EmptyState({ className, icon, title, description, action, ...props }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 px-6 text-center", className)} {...props}>
      {icon ? <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low text-muted mb-1">{icon}</div> : null}
      <h3 className="font-headline text-base font-semibold text-on-surface">{title}</h3>
      {description ? <p className="text-sm text-muted max-w-xs">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
