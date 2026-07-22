"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/design-tokens";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClass = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const;

/**
 * Centered dialog for focused tasks (edit forms, detail views). For a
 * yes/no destructive confirmation, use `ConfirmDialog` instead — it's built
 * on this same primitive with the right defaults already applied.
 */
export function Modal({ open, onOpenChange, title, description, children, footer, size = "md" }: ModalProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-(--z-index-modal-backdrop) bg-inverse-surface/40 backdrop-blur-sm data-[state=open]:animate-dropdown" />
        <RadixDialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-(--z-index-modal) w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-dialog bg-surface p-6 shadow-floating",
            "focus:outline-none data-[state=open]:animate-dropdown",
            sizeClass[size]
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
          <div className="text-sm text-on-surface">{children}</div>
          {footer ? <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-border">{footer}</div> : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
