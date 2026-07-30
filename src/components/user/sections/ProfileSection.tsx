import type { ReactNode } from "react";

/**
 * The heading block each profile panel opens with.
 *
 * With the tabs moved into a side rail, the panel beside it needs to name
 * itself — the selected rail item is off to the left and easy to lose, and on
 * mobile the strip scrolls the active item out of view entirely. A one-line
 * description under each title also gives the panels a consistent top edge,
 * which is most of what made the old page feel unfinished: content started at a
 * different height depending on which tab you were on.
 */
export function ProfileSection({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
