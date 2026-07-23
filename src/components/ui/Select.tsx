"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/design-tokens";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

/**
 * Built on Radix's unstyled Select — full keyboard nav (arrow keys, type-
 * ahead, Home/End), correct ARIA roles, and focus management come for free
 * instead of being hand-rolled per instance.
 */
export function Select({
  label,
  hint,
  error,
  placeholder = "Select…",
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  className,
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <span className="text-sm font-medium text-on-surface">{label}</span> : null}
      <RadixSelect.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled} name={name}>
        <RadixSelect.Trigger
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-input border bg-surface px-3 text-sm text-on-surface",
            "border-outline-variant transition-colors duration-(--duration-fast) ease-(--ease-out)",
            "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
            "disabled:opacity-50 disabled:pointer-events-none data-[placeholder]:text-muted",
            error && "border-error focus:ring-error/40 focus:border-error"
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown size={ICON_SIZE.sm} className="text-muted" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={6}
            className="z-(--z-index-popover) overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-elevated animate-dropdown"
          >
            <RadixSelect.Viewport
              className="max-h-80 overflow-y-auto p-1"
              // Never taller than the space between the trigger and the screen
              // edge (Radix sets this var in popper mode); the max-h-80 cap keeps
              // long lists — e.g. the 48 half-hour times in TimeSelect — from
              // filling the whole viewport. Either way it scrolls.
              style={{ maxHeight: "min(20rem, var(--radix-select-content-available-height))" }}
            >
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-on-surface outline-none",
                    "data-[highlighted]:bg-surface-container-low data-[disabled]:opacity-40 data-[disabled]:pointer-events-none"
                  )}
                >
                  <RadixSelect.ItemIndicator className="absolute left-2.5 flex items-center">
                    <Check size={ICON_SIZE.sm} className="text-primary" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error ? <p className="text-xs text-error">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
