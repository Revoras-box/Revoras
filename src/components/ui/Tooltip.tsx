"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}

/** Wrap a single focusable/hoverable element. Requires `<TooltipProvider>` once near the app root (see AppProviders). */
export function Tooltip({ content, children, side = "top", delayDuration = 300 }: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-(--z-index-tooltip) rounded-md bg-inverse-surface px-2.5 py-1.5 text-xs font-medium text-inverse-on-surface shadow-elevated",
            "animate-dropdown"
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-inverse-surface" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}

export const TooltipProvider = RadixTooltip.Provider;
