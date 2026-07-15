import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp: string;
  icon?: React.ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const dotTone = {
  primary: "bg-primary",
  success: "bg-secondary",
  warning: "bg-tertiary",
  danger: "bg-error",
  neutral: "bg-outline",
} as const;

/** Chronological event history — admin audit log, a single booking's status history. Oldest-to-newest order is the caller's responsibility, not this component's. */
export function Timeline({ events, className }: TimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {events.map((event, i) => (
        <li key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
          {i < events.length - 1 ? <span className="absolute left-[9px] top-5 bottom-0 w-px bg-border" /> : null}
          <span className={cn("relative z-10 mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-on-primary", dotTone[event.tone ?? "neutral"])}>
            {event.icon}
          </span>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-on-surface">{event.title}</span>
              <time className="shrink-0 text-xs text-muted">{event.timestamp}</time>
            </div>
            {event.description ? <p className="text-xs text-muted mt-0.5">{event.description}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
