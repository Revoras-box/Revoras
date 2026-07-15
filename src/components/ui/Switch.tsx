"use client";

import { useId } from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  label?: React.ReactNode;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function Switch({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  id,
  className,
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      {label ? (
        <label htmlFor={switchId} className="flex flex-col cursor-pointer select-none">
          <span className="text-sm text-on-surface leading-tight">{label}</span>
          {description ? <span className="text-xs text-muted mt-0.5">{description}</span> : null}
        </label>
      ) : null}
      <RadixSwitch.Root
        id={switchId}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full bg-surface-container-highest transition-colors",
          "duration-(--duration-fast) ease-(--ease-out)",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "data-[state=checked]:bg-primary disabled:opacity-50 disabled:pointer-events-none"
        )}
      >
        <RadixSwitch.Thumb
          className={cn(
            "block h-4.5 w-4.5 translate-x-1 rounded-full bg-surface shadow-soft transition-transform",
            "duration-(--duration-fast) ease-(--ease-out) will-change-transform",
            "data-[state=checked]:translate-x-5"
          )}
        />
      </RadixSwitch.Root>
    </div>
  );
}
