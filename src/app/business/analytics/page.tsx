"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Badge } from "@/components/ui/Badge";
import { CalendarDays, Receipt, TrendingUp } from "lucide-react";
import { useBusinessAuth } from "@/lib/business/auth";
import { useAnalytics } from "@/lib/business/hooks/useAnalytics";
import { TrendAreaChart } from "@/components/business/charts/TrendAreaChart";
import { RankedBarChart } from "@/components/business/charts/RankedBarChart";
import { formatINR } from "@/lib/format";
import { ICON_SIZE } from "@/lib/design-tokens";

interface MemberPerf {
  id: string;
  name: string;
  designation: string | null;
  status: string;
  bookingsCount: number;
  revenue: number;
}

const PERIOD_OPTIONS = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "quarter", label: "This quarter" },
  { value: "year", label: "This year" },
];

const formatHour = (hour: number) => `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? "am" : "pm"}`;

export default function AnalyticsPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const [period, setPeriod] = useState("month");
  const [memberPage, setMemberPage] = useState(1);

  const { data, isLoading, isError, refetch } = useAnalytics(studioId, { period, page: memberPage, limit: 10 });

  const memberColumns: DataTableColumn<MemberPerf>[] = [
    { key: "name", header: "Professional", render: (m) => (
      <div>
        <div className="font-medium text-on-surface">{m.name}</div>
        {m.designation ? <div className="text-xs text-muted">{m.designation}</div> : null}
      </div>
    ) },
    { key: "bookings", header: "Bookings", align: "right", render: (m) => m.bookingsCount },
    { key: "revenue", header: "Revenue", align: "right", render: (m) => formatINR(m.revenue) },
    { key: "status", header: "Status", render: (m) => <Badge tone={m.status === "active" ? "success" : "neutral"}>{m.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="How your business is performing."
        actions={<Select className="w-44" value={period} onValueChange={setPeriod} options={PERIOD_OPTIONS} />}
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load analytics." />
      ) : isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : data ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total bookings" value={data.totals.bookings} icon={<CalendarDays size={ICON_SIZE.md} />} />
            <StatCard label="Total revenue" value={formatINR(data.totals.revenue)} icon={<TrendingUp size={ICON_SIZE.md} />} />
            <StatCard label="Average ticket" value={formatINR(data.totals.avgTicket)} icon={<Receipt size={ICON_SIZE.md} />} />
          </div>

          <Section title="Revenue over time">
            <Card>
              <TrendAreaChart
                data={data.revenueOverTime.map((p) => ({
                  label: new Date(p.bucket).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
                  value: p.revenue,
                }))}
                valueFormatter={(v) => formatINR(v)}
              />
            </Card>
          </Section>

          <div className="grid lg:grid-cols-2 gap-6">
            <Section title="Top services">
              <Card>
                <RankedBarChart data={data.topServices.map((s) => ({ label: s.name, value: s.bookingsCount }))} />
              </Card>
            </Section>
            <Section title="Peak hours">
              <Card>
                <RankedBarChart data={data.peakHours.map((h) => ({ label: formatHour(h.hour), value: h.bookingsCount }))} />
              </Card>
            </Section>
          </div>

          <Section title="Reviews">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-on-surface">{data.reviews.avgRating.toFixed(1)}</span>
                <span className="text-sm text-muted">from {data.reviews.total} reviews</span>
              </div>
              <RankedBarChart
                data={[5, 4, 3, 2, 1].map((star) => ({ label: `${star}★`, value: data.reviews.distribution[String(star)] || 0 }))}
                height={180}
              />
            </Card>
          </Section>

          <Section title="Professional performance">
            <Card padding="none">
              <DataTable columns={memberColumns} data={data.memberPerformance.members} rowKey={(m) => m.id} emptyTitle="No professionals yet" />
            </Card>
            {data.memberPerformance.pagination.pages > 1 ? (
              <Pagination
                page={data.memberPerformance.pagination.page}
                pages={data.memberPerformance.pagination.pages}
                onPageChange={setMemberPage}
              />
            ) : null}
          </Section>
        </div>
      ) : null}
    </div>
  );
}
