"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ScheduleResource {
  id: string;
  label: string;
  avatar?: React.ReactNode;
}

export interface ScheduleEvent {
  id: string;
  resourceId: string;
  label: string;
  /** Minutes from midnight. */
  startMinutes: number;
  endMinutes: number;
  tone?: "primary" | "success" | "warning" | "neutral";
  onClick?: () => void;
  /** Opt in to drag-to-move. Requires `onEventDrop` on the grid to do anything. */
  draggable?: boolean;
}

export interface ScheduleDropPayload {
  eventId: string;
  /** The resource column the event was dropped on — may differ from where it started. */
  resourceId: string;
  /** Snapped minutes-from-midnight of the new start. Duration is the caller's to preserve. */
  startMinutes: number;
}

export interface ScheduleGridProps {
  resources: ScheduleResource[];
  events: ScheduleEvent[];
  /** 24h clock bounds for the visible grid. */
  startHour?: number;
  endHour?: number;
  className?: string;
  /** Fires when a `draggable` event is dropped on a new slot. Omit to keep the grid read-only. */
  onEventDrop?: (payload: ScheduleDropPayload) => void;
  /** Minute granularity drops snap to. */
  snapMinutes?: number;
}

const toneClass = {
  primary: "bg-primary-container text-on-primary-container border-primary/30",
  success: "bg-secondary-container text-on-secondary-container border-secondary/30",
  warning: "bg-tertiary-container text-on-surface border-tertiary/30",
  neutral: "bg-surface-container-high text-on-surface-variant border-outline-variant",
} as const;

const ROW_HEIGHT = 56; // px per hour

/**
 * Resource-by-time schedule grid — Business "Today"/"Calendar" and the
 * booking-flow's professional availability view both consume this. Takes
 * resources (professionals) and events (bookings/time-off) as plain data;
 * it doesn't know these are "bookings" from the backend's point of view.
 */
export function ScheduleGrid({
  resources,
  events,
  startHour = 9,
  endHour = 21,
  className,
  onEventDrop,
  snapMinutes = 15,
}: ScheduleGridProps) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const dragEnabled = !!onEventDrop;

  /**
   * Translate a drop anywhere in an hour cell into a snapped start time. Measured
   * against the cell's own box rather than `offsetY`, which reports relative to
   * whatever child element the pointer happened to be over.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, resourceId: string, hour: number) => {
    if (!onEventDrop || !draggingId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const minutesIntoHour = ((e.clientY - rect.top) / rect.height) * 60;
    const snapped = Math.round(minutesIntoHour / snapMinutes) * snapMinutes;
    const startMinutes = Math.max(0, hour * 60 + Math.min(snapped, 60 - snapMinutes));
    onEventDrop({ eventId: draggingId, resourceId, startMinutes });
    setDraggingId(null);
  };

  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border", className)}>
      <div className="grid min-w-max" style={{ gridTemplateColumns: `72px repeat(${resources.length}, minmax(160px, 1fr))` }}>
        <div className="sticky left-0 z-10 bg-surface border-b border-r border-border" />
        {resources.map((r) => (
          <div key={r.id} className="flex items-center gap-2 border-b border-l border-border bg-surface-container-low px-3 py-2.5 text-sm font-medium text-on-surface">
            {r.avatar}
            <span className="truncate">{r.label}</span>
          </div>
        ))}

        {hours.map((hour) => (
          <div key={hour} className="contents">
            <div className="sticky left-0 z-10 border-r border-border bg-surface px-2 py-1 text-right text-xs text-muted" style={{ height: ROW_HEIGHT }}>
              {hour % 12 === 0 ? 12 : hour % 12}
              {hour < 12 ? "am" : "pm"}
            </div>
            {resources.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "relative border-l border-t border-border",
                  draggingId && "bg-primary-container/10"
                )}
                style={{ height: ROW_HEIGHT }}
                onDragOver={dragEnabled && draggingId ? (ev) => ev.preventDefault() : undefined}
                onDrop={dragEnabled ? (ev) => handleDrop(ev, r.id, hour) : undefined}
              >
                {events
                  .filter((e) => e.resourceId === r.id && Math.floor(e.startMinutes / 60) === hour)
                  .map((e) => {
                    const top = ((e.startMinutes % 60) / 60) * ROW_HEIGHT;
                    const height = Math.max(((e.endMinutes - e.startMinutes) / 60) * ROW_HEIGHT, 22);
                    const canDrag = dragEnabled && !!e.draggable;
                    return (
                      <button
                        key={e.id}
                        onClick={e.onClick}
                        draggable={canDrag}
                        onDragStart={canDrag ? () => setDraggingId(e.id) : undefined}
                        onDragEnd={canDrag ? () => setDraggingId(null) : undefined}
                        className={cn(
                          "absolute left-1 right-1 rounded-md border px-2 py-1 text-left text-xs font-medium truncate",
                          "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:brightness-95",
                          canDrag && "cursor-grab active:cursor-grabbing",
                          draggingId === e.id && "opacity-40",
                          toneClass[e.tone ?? "primary"]
                        )}
                        style={{ top, height }}
                      >
                        {e.label}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
