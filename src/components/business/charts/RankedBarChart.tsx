"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";

export interface RankedBarDatum {
  label: string;
  value: number;
}

/**
 * Horizontal ranked bar - single hue throughout (identity comes from the
 * axis label, not from color), so no categorical palette is needed here.
 * Used for Top Services, Peak Hours, and the review-rating distribution.
 */
export function RankedBarChart({
  data,
  valueFormatter = (v: number) => String(v),
  height = 220,
}: {
  data: RankedBarDatum[];
  valueFormatter?: (v: number) => string;
  height?: number;
}) {
  if (data.length === 0) {
    return <EmptyState title="No data yet" description="This will fill in once there's enough activity to rank." />;
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
          <XAxis
            type="number"
            allowDecimals={false}
            stroke="var(--color-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
          />
          <YAxis
            type="category"
            dataKey="label"
            stroke="var(--color-on-surface)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              fontSize: 13,
            }}
            labelStyle={{ color: "var(--color-on-surface)", fontWeight: 600 }}
            formatter={(value) => [valueFormatter(Number(value)), ""]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill="var(--color-primary)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
