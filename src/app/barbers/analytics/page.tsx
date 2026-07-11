"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";

// Types
interface AnalyticsData {
  period: string;
  totals: {
    revenue: number;
    bookings: number;
    avgTicket: string;
    reviews: number;
    avgRating: string;
  };
  topServices: Array<{
    name: string;
    revenue: number;
    bookings: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    month_num: number;
    revenue: number;
  }>;
  peakHours: Array<{
    hour: number;
    bookings: number;
  }>;
}

function AnalyticsContent() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>("month");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { loading: authLoading, isAuthenticated } = useBarberAuth();
  const router = useRouter();

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getBarberAnalytics(period) as AnalyticsData & { error?: string };
      
      if (!('error' in result) || !result.error) {
        setAnalytics(result);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login-barber");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated, fetchAnalytics]);

  // Format currency
  const formatCurrency = (amount: number) => formatINR(amount);

  // Get max values for charts
  const maxRevenue = analytics?.revenueByMonth?.length 
    ? Math.max(...analytics.revenueByMonth.map(m => m.revenue)) 
    : 100;
  
  const maxBookings = analytics?.peakHours?.length 
    ? Math.max(...analytics.peakHours.map(h => h.bookings)) 
    : 10;
  
  const totalServiceRevenue = analytics?.topServices?.reduce((sum, s) => sum + s.revenue, 0) || 1;

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-fixed-dim/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpis = analytics ? [
    { 
      label: "Total Revenue", 
      value: formatCurrency(analytics.totals.revenue), 
      icon: "payments" 
    },
    { 
      label: "Avg. Ticket", 
      value: formatCurrency(parseFloat(analytics.totals.avgTicket)), 
      icon: "receipt" 
    },
    { 
      label: "Total Bookings", 
      value: String(analytics.totals.bookings), 
      icon: "calendar_today" 
    },
    { 
      label: "Avg. Rating", 
      value: analytics.totals.avgRating, 
      icon: "star" 
    },
  ] : [];

  return (
    <div className="min-h-screen bg-surface-container-lowest text-foreground">
      <BarberSidebar />
      <main className="lg:ml-72 flex-1 min-h-screen flex flex-col">
        <header className="h-20 pl-16 pr-6 lg:px-10 flex justify-between items-center bg-surface-container-low/60 backdrop-blur-xl z-40 sticky top-0">
          <div className="flex items-center gap-8">
            <h2 className="font-headline font-black text-2xl tracking-tight text-foreground">Revenue Intelligence</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 p-1 bg-surface-container-lowest rounded-full">
              {(["week", "month", "quarter", "year"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                    period === p
                      ? "bg-primary-fixed-dim text-primary-foreground font-bold"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-surface-container-lowest">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary-fixed-dim/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : !analytics ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-muted mb-4">insights</span>
              <p className="text-muted">No analytics data available yet</p>
              <p className="text-sm text-muted/60 mt-2">Complete some bookings to see your performance</p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-6">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary-fixed-dim/5 rounded-bl-full -mr-4 -mt-4"></div>
                    <div className="relative z-10">
                      <span className="material-symbols-outlined text-primary text-2xl mb-3">{kpi.icon}</span>
                      <p className="text-[10px] text-muted uppercase tracking-widest mb-1">{kpi.label}</p>
                      <p className="text-3xl font-headline font-black text-foreground">{kpi.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-12 gap-6">
                {/* Revenue Chart */}
                <div className="col-span-8 bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline font-black text-lg text-foreground">Revenue Trend</h3>
                    <span className="text-sm text-muted capitalize">{period}ly overview</span>
                  </div>
                  {/* Chart */}
                  {analytics.revenueByMonth?.length > 0 ? (
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                      {analytics.revenueByMonth.map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="text-xs text-primary mb-1">{formatCurrency(m.revenue)}</div>
                          <div 
                            className="w-full bg-gradient-to-t from-primary-fixed-dim to-primary-fixed-dim/50 rounded-t-lg transition-all hover:from-primary-fixed-dim hover:to-primary-container"
                            style={{ height: `${Math.max((m.revenue / maxRevenue) * 180, 10)}px` }}
                          ></div>
                          <span className="text-[10px] text-muted">{m.month}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted">
                      No revenue data for this period
                    </div>
                  )}
                </div>

                {/* Top Services */}
                <div className="col-span-4 bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
                  <h3 className="font-headline font-black text-lg text-foreground mb-6">Top Services</h3>
                  {analytics.topServices?.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.topServices.map((service) => (
                        <div key={service.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground font-medium">{service.name}</span>
                            <span className="text-sm text-primary font-bold">{formatCurrency(service.revenue)}</span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-primary-fixed-dim to-primary-container"
                              style={{ width: `${(service.revenue / totalServiceRevenue) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-muted">{service.bookings} bookings</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted">
                      No service data available
                    </div>
                  )}
                </div>
              </div>

              {/* Peak Hours */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
                  <h3 className="font-headline font-black text-lg text-foreground mb-6">Peak Hours</h3>
                  {analytics.peakHours?.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.peakHours.map((hour) => {
                        const loadPercent = maxBookings > 0 ? (hour.bookings / maxBookings) * 100 : 0;
                        const displayHour = hour.hour > 12 ? `${hour.hour - 12} PM` : hour.hour === 12 ? '12 PM' : `${hour.hour} AM`;
                        
                        return (
                          <div key={hour.hour} className="flex items-center gap-4">
                            <span className="text-xs text-muted w-12">{displayHour}</span>
                            <div className="flex-1 h-8 bg-surface-container-highest/30 rounded-lg overflow-hidden">
                              <div 
                                className={`h-full rounded-lg transition-all ${
                                  loadPercent > 90 ? 'bg-red-500/60' :
                                  loadPercent > 70 ? 'bg-primary-fixed-dim/60' :
                                  loadPercent > 50 ? 'bg-green-500/60' :
                                  'bg-outline-variant/60'
                                }`}
                                style={{ width: `${loadPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-foreground w-16 text-right">{hour.bookings} bookings</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted">
                      No booking data available
                    </div>
                  )}
                  <div className="mt-4 flex justify-center gap-4 text-[10px] text-muted">
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-outline-variant/60 mr-1"></span>Low</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500/60 mr-1"></span>Medium</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-fixed-dim/60 mr-1"></span>High</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500/60 mr-1"></span>Peak</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <BarberAuthProvider>
      <AnalyticsContent />
    </BarberAuthProvider>
  );
}
