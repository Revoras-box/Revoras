"use client";

import { useId } from "react";
import * as RadixRadio from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  label?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  label,
  orientation = "vertical",
  className,
}: RadioGroupProps) {
  const groupId = useId();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? <span className="text-sm font-medium text-on-surface">{label}</span> : null}
      <RadixRadio.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap")}
      >
        {options.map((opt) => {
          const itemId = `${groupId}-${opt.value}`;
          return (
            <div key={opt.value} className="flex items-start gap-2.5">
              <RadixRadio.Item
                id={itemId}
                value={opt.value}
                disabled={opt.disabled}
                className={cn(
                  "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface",
                  "transition-colors duration-(--duration-fast) ease-(--ease-out)",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  "data-[state=checked]:border-primary",
                  "disabled:opacity-50 disabled:pointer-events-none"
                )}
              >
                <RadixRadio.Indicator className="h-2 w-2 rounded-full bg-primary" />
              </RadixRadio.Item>
              <label htmlFor={itemId} className="flex flex-col cursor-pointer select-none">
                <span className="text-sm text-on-surface leading-tight">{opt.label}</span>
                {opt.description ? <span className="text-xs text-muted mt-0.5">{opt.description}</span> : null}
              </label>
            </div>
          );
        })}
      </RadixRadio.Root>
    </div>
  );
}
