import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Primary action(s) — a Button or a row of Buttons, right-aligned on desktop. */
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

/** Top-of-page identity block — used once per screen, above the first Section. */
export function PageHeader({ className, eyebrow, title, description, actions, breadcrumb, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 pb-6 border-b border-border mb-6", className)} {...props}>
      {breadcrumb}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          {eyebrow ? (
            <div className="text-xs font-label font-semibold uppercase tracking-wide text-primary mb-1.5">{eyebrow}</div>
          ) : null}
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface text-balance">{title}</h1>
          {description ? <p className="text-sm text-muted mt-2 max-w-2xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-3 shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}
