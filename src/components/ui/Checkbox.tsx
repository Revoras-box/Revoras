"use client";

import { useId } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/design-tokens";

export interface CheckboxProps {
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

export function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  id,
  className,
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <RadixCheckbox.Root
        id={checkboxId}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border border-outline-variant bg-surface",
          "transition-colors duration-(--duration-fast) ease-(--ease-out)",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
          "disabled:opacity-50 disabled:pointer-events-none"
        )}
      >
        <RadixCheckbox.Indicator>
          <Check size={ICON_SIZE.sm} className="text-on-primary" strokeWidth={3} />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label ? (
        <label htmlFor={checkboxId} className="flex flex-col cursor-pointer select-none">
          <span className="text-sm text-on-surface leading-tight">{label}</span>
          {description ? <span className="text-xs text-muted mt-0.5">{description}</span> : null}
        </label>
      ) : null}
    </div>
  );
}
