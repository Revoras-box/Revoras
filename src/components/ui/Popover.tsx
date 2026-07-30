"use client";

import * as RadixPopover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

/**
 * An anchored overlay for *content*, as distinct from DropdownMenu next door,
 * which is an anchored overlay for *commands*.
 *
 * The distinction is not cosmetic. Radix's DropdownMenu renders `role="menu"`
 * with `role="menuitem"` children, which tells a screen reader "this is a list
 * of actions, arrow keys move between them, typing jumps to a matching one".
 * That description is true of an account menu and false of a notification feed:
 * the items are records, not commands, they wrap onto several lines, the list
 * scrolls, and typeahead trying to match a notification's body text is noise.
 * Menu semantics also close the overlay on any item activation, which is wrong
 * for "mark this one read" - the point is to stay open and keep reading.
 *
 * Popover carries no such promises. It is a labelled dialog-ish surface that
 * traps focus while open, closes on Escape and outside click, and leaves the
 * content's own semantics alone.
 *
 * Styling deliberately mirrors DropdownMenuContent - same radius, border,
 * surface, elevation and z-token - so the two read as one family despite
 * answering to different primitives.
 */
export const Popover = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverClose = RadixPopover.Close;
export const PopoverAnchor = RadixPopover.Anchor;

export function PopoverContent({ className, align = "end", sideOffset = 8, ...props }: RadixPopover.PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align={align}
        sideOffset={sideOffset}
        // Keeps the panel inside the viewport on small screens rather than
        // letting it run off the edge under a right-aligned trigger.
        collisionPadding={12}
        className={cn(
          "z-(--z-index-popover) rounded-xl border border-border bg-surface shadow-elevated",
          // `--radix-popover-content-available-height` is measured by Radix
          // against the actual viewport, so a long list scrolls inside the panel
          // instead of pushing it past the bottom of the screen.
          "max-h-(--radix-popover-content-available-height)",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        )}
        {...props}
      />
    </RadixPopover.Portal>
  );
}
