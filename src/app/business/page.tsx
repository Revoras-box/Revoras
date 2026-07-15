"use client";

import Link from "next/link";
import { Calendar, ClipboardList, Star, TrendingUp, Users, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ListItem } from "@/components/ui/ListItem";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { TrendAreaChart } from "@/components/business/charts/TrendAreaChart";
import { RankedBarChart } from "@/components/business/charts/RankedBarChart";
import { useBusinessAuth } from "@/lib/business/auth";
import { useDashboard } from "@/lib/business/hooks/useDashboard";
import { useAnalytics } from "@/lib/business/hooks/useAnalytics";
import { hasPermission, PERMISSIONS } from "@/lib/business/permissions";
import { formatINR } from "@/lib/format";
import { ICON_SIZE } from "@/lib/design-tokens";

const STATUS_TONE: Record<string, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "primary",
  completed: "success",
  cancelled: "neutral",
  no_show: "danger",
};

export default function BusinessDashboardPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const permissions = activeMembership?.permissions || [];
  const canViewAnalytics = hasPermission(permissions, PERMISSIONS.ANALYTICS_VIEW);

  const dashboard = useDashboard(studioId);
  const analytics = useAnalytics(studioId, canViewAnalytics ? { period: "month" } : undefined);

  return (
    <div>
      <PageHeader
        eyebrow={activeMembership?.businessName}
        title="Dashboard"
        description="A live overview of today's business."
        actions={
          <Button asChild intent="outline">
            <Link href="/business/appointments">
              <ClipboardList size={ICON_SIZE.sm} /> View appointments
            </Link>
          </Button>
        }
      />

      {dashboard.isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : dashboard.isError ? (
        <ErrorState onRetry={() => dashboard.refetch()} description="Couldn't load your dashboard." />
      ) : dashboard.data ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatCard label="Today's bookings" value={dashboard.data.today.bookingsCount} icon={<Calendar size={ICON_SIZE.md} />} />
            <StatCard label="Today's revenue" value={formatINR(dashboard.data.today.revenue)} icon={<Wallet size={ICON_SIZE.md} />} />
            <StatCard
              label="This week's revenue"
              value={formatINR(dashboard.data.revenue.thisWeek)}
              icon={<TrendingUp size={ICON_SIZE.md} />}
              trend={dashboard.data.revenue.weekChangePercent}
            />
            <StatCard label="Pending" value={dashboard.data.bookingStatusCounts.pending || 0} icon={<ClipboardList size={ICON_SIZE.md} />} />
            <StatCard label="New customers (30d)" value={dashboard.data.newCustomersCount} icon={<Users size={ICON_SIZE.md} />} />
            <StatCard
              label="Average rating"
              value={dashboard.data.averageRating > 0 ? dashboard.data.averageRating.toFixed(1) : "—"}
              icon={<Star size={ICON_SIZE.md} />}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {canViewAnalytics ? (
                <Section title="Revenue trend" description="Completed bookings, last 30 days">
                  <Card>
                    {analytics.isLoading ? (
                      <Skeleton className="h-64 w-full" />
                    ) : analytics.data ? (
                      <TrendAreaChart
                        data={analytics.data.revenueOverTime.map((p) => ({
                          label: new Date(p.bucket).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
                          value: p.revenue,
                        }))}
                        valueFormatter={(v) => formatINR(v)}
                      />
                    ) : null}
                  </Card>
                </Section>
              ) : null}

              <Section title="Upcoming appointments" action={<Link href="/business/appointments" className="text-sm font-medium text-primary">View all</Link>}>
                <Card padding="sm">
                  {dashboard.data.upcomingBookings.length === 0 ? (
                    <EmptyState title="Nothing upcoming" description="New bookings will show up here as customers book." />
                  ) : (
                    <div className="flex flex-col divide-y divide-border">
                      {dashboard.data.upcomingBookings.map((b) => (
                        <ListItem
                          key={b.id}
                          leading={<Avatar name={b.customer_name} src={b.customer_image} size="sm" />}
                          title={b.customer_name}
                          subtitle={`${new Date(b.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${b.start_time.slice(0, 5)} · with ${b.member_name}`}
                          trailing={<Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge>}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              </Section>
            </div>

            <div className="flex flex-col gap-6">
              <Section title="Popular services">
                <Card>
                  {dashboard.data.popularServices.length === 0 ? (
                    <EmptyState title="No data yet" description="Service popularity fills in over the last 30 days." />
                  ) : (
                    <RankedBarChart
                      data={dashboard.data.popularServices.map((s) => ({ label: s.name, value: s.bookingsCount }))}
                      height={dashboard.data.popularServices.length * 44 + 16}
                    />
                  )}
                </Card>
              </Section>

              <Section title="Active professionals">
                <Card padding="sm">
                  {dashboard.data.activeProfessionals.length === 0 ? (
                    <EmptyState title="No professionals yet" description="Add your team from the Professionals page." />
                  ) : (
                    <div className="flex flex-col divide-y divide-border">
                      {dashboard.data.activeProfessionals.map((p) => (
                        <ListItem
                          key={p.id}
                          leading={<Avatar name={p.name} src={p.imageUrl} size="sm" />}
                          title={p.name}
                          subtitle={p.designation || undefined}
                          trailing={
                            <div className="text-right">
                              <div className="text-sm font-medium text-on-surface">{p.todayBookingsCount} today</div>
                              {p.rating > 0 ? <div className="text-xs text-muted">★ {p.rating.toFixed(1)}</div> : null}
                            </div>
                          }
                        />
                      ))}
                    </div>
                  )}
                </Card>
              </Section>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
