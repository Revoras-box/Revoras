"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** The three rules a strong Revoras password must satisfy. */
export const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
] as const;

/** Single source of truth for whether a password passes every rule. */
export function isStrongPassword(value: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(value));
}

/**
 * Live checklist shown beneath a password field. Each rule turns green the
 * moment its condition is met, so the requirement and the feedback stay in one
 * place. Renders nothing until the user starts typing to avoid a wall of red.
 */
export function PasswordChecklist({ value, className }: { value: string; className?: string }) {
  if (!value) return null;
  return (
    <ul className={cn("flex flex-col gap-1", className)} aria-live="polite">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(value);
        return (
          <li
            key={rule.label}
            className={cn("flex items-center gap-1.5 text-xs transition-colors", ok ? "text-primary" : "text-muted")}
          >
            <span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded-full", ok ? "bg-primary/15" : "bg-surface-container-high")}>
              {ok ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} className="text-muted" />}
            </span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
