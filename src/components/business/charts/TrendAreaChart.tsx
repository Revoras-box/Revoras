"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";

export interface TrendPoint {
  label: string;
  value: number;
}

/**
 * Single-series trend (revenue/bookings over time) - one hue only, so the
 * dataviz skill's categorical CVD check doesn't apply. The brand's primary
 * gold is below the 3:1 contrast-vs-surface floor on a white background
 * (dataviz skill's palette validator flags this as a WARN, not a fail); the
 * required mitigation is the tooltip + explicit value formatting here rather
 * than relying on the fill color alone to carry the numbers.
 */
export function TrendAreaChart({ data, valueFormatter = (v: number) => String(v) }: { data: TrendPoint[]; valueFormatter?: (v: number) => string }) {
  if (data.length === 0) {
    return <EmptyState title="No data yet" description="This chart will fill in once bookings start coming through." />;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="label" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} width={48} tickFormatter={valueFormatter} />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              fontSize: 13,
            }}
            labelStyle={{ color: "var(--color-on-surface)", fontWeight: 600 }}
            formatter={(value) => [valueFormatter(Number(value)), "Revenue"]}
          />
          <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill="url(#revenueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
