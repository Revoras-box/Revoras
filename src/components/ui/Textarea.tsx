"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, wrapperClassName, label, hint, error, id, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const hintId = `${fieldId}-hint`;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label ? (
          <label htmlFor={fieldId} className="text-sm font-medium text-on-surface">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={hint || error ? hintId : undefined}
          className={cn(
            "w-full resize-y rounded-lg border bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-muted",
            "transition-colors duration-(--duration-fast) ease-(--ease-out)",
            "border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
            "disabled:opacity-50 disabled:pointer-events-none",
            error && "border-error focus:ring-error/40 focus:border-error",
            className
          )}
          {...props}
        />
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
Textarea.displayName = "Textarea";
