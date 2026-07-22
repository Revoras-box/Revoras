"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Helper text shown below the field when there's no error. */
  hint?: string;
  /** Error message. When set, the field switches to its error state and this replaces `hint`. */
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  wrapperClassName?: string;
}

/**
 * Text input with an attached label/hint/error — the field, not just the
 * `<input>`, is the reusable unit, so every form in the app gets the same
 * label spacing and error presentation without re-deriving it per page.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, label, hint, error, leadingIcon, trailingIcon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-on-surface">
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center">
          {leadingIcon ? (
            <span className="pointer-events-none absolute left-3 flex text-muted">{leadingIcon}</span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={hint || error ? hintId : undefined}
            className={cn(
              "h-10 w-full rounded-input border bg-surface px-3 text-sm text-on-surface placeholder:text-muted",
              "transition-colors duration-(--duration-fast) ease-(--ease-out)",
              "border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
              "disabled:opacity-50 disabled:pointer-events-none",
              error && "border-error focus:ring-error/40 focus:border-error",
              leadingIcon && "pl-9",
              trailingIcon && "pr-9",
              className
            )}
            {...props}
          />
          {trailingIcon ? <span className="pointer-events-none absolute right-3 flex text-muted">{trailingIcon}</span> : null}
        </div>
        {error ? (
          <p id={hintId} className="text-xs text-error">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
