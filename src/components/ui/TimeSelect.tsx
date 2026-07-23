"use client";

import { useMemo } from "react";
import { Select } from "./Select";

const pad = (n: number) => String(n).padStart(2, "0");

/** "HH:mm" (24h) → "h:mm AM/PM" for display. */
export function formatTimeLabel(value: string): string {
  const [hStr, mStr] = value.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${period}`;
}

export interface TimeSelectProps {
  /** "HH:mm" (24h). Only the first 5 chars are used, so "09:00:00" is fine. */
  value?: string;
  onChange: (value: string) => void;
  /** Minutes between options. 30 by default (business-hours granularity). */
  stepMinutes?: number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A friendly time picker: an on-brand dropdown of every `stepMinutes`-th time of
 * day, replacing the native `<input type="time">` spinner (three tiny scroll
 * columns) that's painful to operate. Values stay "HH:mm" 24h so callers and the
 * backend are unchanged; only the display is 12h "9:00 AM". Radix's Select gives
 * keyboard nav and type-ahead ("9" jumps to 9:00 AM) for free.
 */
export function TimeSelect({
  value,
  onChange,
  stepMinutes = 30,
  label,
  placeholder = "Select time",
  disabled,
  className,
}: TimeSelectProps) {
  const norm = value?.slice(0, 5);

  const options = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    for (let mins = 0; mins < 24 * 60; mins += stepMinutes) {
      const v = `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
      opts.push({ value: v, label: formatTimeLabel(v) });
    }
    // Keep an off-grid stored time (e.g. a legacy "09:05") selectable so the
    // field doesn't render blank when it doesn't fall on the step boundary.
    if (norm && !opts.some((o) => o.value === norm)) {
      opts.push({ value: norm, label: formatTimeLabel(norm) });
      opts.sort((a, b) => a.value.localeCompare(b.value));
    }
    return opts;
  }, [stepMinutes, norm]);

  return (
    <Select
      className={className}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      value={norm || undefined}
      onValueChange={onChange}
      options={options}
    />
  );
}
