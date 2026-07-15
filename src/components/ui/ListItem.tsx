import { cn } from "@/lib/utils";

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned slot — a Badge, an amount, an action Button. */
  trailing?: React.ReactNode;
  interactive?: boolean;
}

/** One row shape for every list in the app — bookings, team members, notifications, admin queues. */
export function ListItem({ className, leading, title, subtitle, trailing, interactive, ...props }: ListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl p-3 border border-transparent",
        interactive && "cursor-pointer transition-colors duration-(--duration-fast) ease-(--ease-out) hover:bg-surface-container-low hover:border-border",
        className
      )}
      {...props}
    >
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-on-surface truncate">{title}</div>
        {subtitle ? <div className="text-xs text-muted truncate mt-0.5">{subtitle}</div> : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
