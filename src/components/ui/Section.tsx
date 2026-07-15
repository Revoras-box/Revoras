import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  /** Rendered to the right of the title — e.g. a "See all" link or an action button. */
  action?: React.ReactNode;
}

/** Vertical rhythm unit for a page: an optional title/description/action row, then content. */
export function Section({ className, title, description, action, children, ...props }: SectionProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)} {...props}>
      {title || action ? (
        <div className="flex items-end justify-between gap-4">
          <div>
            {title ? <h2 className="font-headline text-xl font-semibold text-on-surface">{title}</h2> : null}
            {description ? <p className="text-sm text-muted mt-1">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
