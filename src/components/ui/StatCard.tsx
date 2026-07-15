import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { ICON_SIZE } from "@/lib/design-tokens";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  /** Percentage change vs. the prior period — positive shows green/up, negative shows red/down. */
  trend?: number;
  trendLabel?: string;
  className?: string;
}

/** A single KPI tile — dashboard "today" summaries and analytics grids both compose from this. */
export function StatCard({ label, value, icon, trend, trendLabel = "vs last period", className }: StatCardProps) {
  const isPositive = typeof trend === "number" && trend >= 0;

  return (
    <Card padding="md" className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        {icon ? <span className="text-primary">{icon}</span> : null}
      </div>
      <span className="font-headline text-2xl font-bold text-on-surface tabular-nums">{value}</span>
      {typeof trend === "number" ? (
        <div className={cn("flex items-center gap-1 text-xs font-medium mt-1", isPositive ? "text-secondary" : "text-error")}>
          {isPositive ? <TrendingUp size={ICON_SIZE.sm} /> : <TrendingDown size={ICON_SIZE.sm} />}
          <span className="tabular-nums">{Math.abs(trend)}%</span>
          <span className="text-muted font-normal">{trendLabel}</span>
        </div>
      ) : null}
    </Card>
  );
}
