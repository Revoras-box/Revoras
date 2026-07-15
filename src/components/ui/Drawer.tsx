"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/design-tokens";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** `right` — detail/edit panels (Business/Admin). `left` — mobile nav (Customer/Business). `bottom` — mobile action sheets. */
  side?: "left" | "right" | "bottom";
}

const sideClass = {
  left: "left-0 top-0 h-full w-[min(88vw,340px)] data-[state=open]:animate-drawer-left",
  right: "right-0 top-0 h-full w-[min(92vw,420px)] data-[state=open]:animate-drawer-right",
  bottom: "left-0 bottom-0 w-full max-h-[85vh] rounded-t-2xl data-[state=open]:animate-drawer-bottom",
} as const;

/**
 * Side/bottom-anchored panel — same job as `Modal` for content too tall or
 * too navigational for a centered dialog (mobile nav, filter panels, detail
 * inspectors). `side="bottom"` is the mobile action-sheet equivalent of a
 * desktop dropdown/modal.
 */
export function Drawer({ open, onOpenChange, title, description, children, footer, side = "right" }: DrawerProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        {/* Own backdrop token, not --z-index-modal-backdrop: that one (1300) sits
            ABOVE --z-index-drawer (1200), which would put this overlay on top of
            the drawer's own content instead of behind it. */}
        <RadixDialog.Overlay className="fixed inset-0 z-(--z-index-drawer-backdrop) bg-inverse-surface/40 backdrop-blur-sm" />
        <RadixDialog.Content
          className={cn(
            "fixed z-(--z-index-drawer) flex flex-col bg-surface shadow-floating focus:outline-none p-6",
            sideClass[side]
          )}
        >
          <div className="flex items-start justify-between gap-4 mb-1">
            <RadixDialog.Title className="font-headline text-lg font-semibold text-on-surface">{title}</RadixDialog.Title>
            <RadixDialog.Close className="rounded-md p-1 text-muted hover:bg-surface-container-low hover:text-on-surface">
              <X size={ICON_SIZE.md} />
              <span className="sr-only">Close</span>
            </RadixDialog.Close>
          </div>
          <RadixDialog.Description className={cn("text-sm text-muted mb-4", !description && "sr-only")}>
            {description ?? title}
          </RadixDialog.Description>
          <div className="flex-1 overflow-y-auto text-sm text-on-surface">{children}</div>
          {footer ? <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border shrink-0">{footer}</div> : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
