"use client";

import { Toaster as SonnerToaster } from "sonner";
export { toast } from "sonner";

/**
 * Mount once near the app root (see AppProviders). Uses sonner's `unstyled`
 * mode with our own token classes rather than syncing sonner's built-in
 * light/dark `theme` prop against our `.dark`-class toggle — one less
 * thing to keep in sync, and it makes toasts match the rest of the design
 * system exactly instead of sonner's own default look.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-start gap-3 w-[min(92vw,380px)] rounded-xl border border-border bg-surface p-4 shadow-elevated text-sm text-on-surface",
          title: "font-medium",
          description: "text-muted mt-0.5",
          actionButton: "rounded-md bg-primary text-on-primary px-2.5 py-1 text-xs font-medium",
          cancelButton: "rounded-md bg-surface-container-high text-on-surface px-2.5 py-1 text-xs font-medium",
          closeButton: "border-border bg-surface text-muted",
          success: "border-secondary/30",
          error: "border-error/30",
          warning: "border-tertiary/30",
        },
      }}
      style={{ zIndex: "var(--z-index-toast)" } as React.CSSProperties}
    />
  );
}
