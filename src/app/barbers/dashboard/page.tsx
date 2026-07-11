"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BarberHeader from "@/components/barber/BarberHeader";
import { useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";

// Types
interface DashboardStats {
  today: {
    appointments: number;
    revenue: number;
    availableSlots: number;
    totalSlots: number;
  };
  week: {
    appointments: number;
    revenue: number;
    change: number;
  };
}

interface Booking {
  id: string;
  appointment_date: string;
  appointment_time: string;
  customer_name: string;
  customer_image?: string;
  total_price: number;
  total_duration?: number;
  status: string;
  services: Array<{ name: string; price: number; duration: number }>;
}

interface TeamMember {
  id: string;
  name: string;
  image_url?: string;
  is_active: boolean;
  today_bookings: number;
  next_available?: string;
}

export default function BarberDashboardPage() {
  const { barber } = useBarberAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }));

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const today = new Date().toISOString().split('T')[0];
        const [dashboardRes, bookingsRes, teamRes] = await Promise.all([
          api.getBarberDashboard() as Promise<DashboardStats | { error?: string }>,
          api.getBarberBookings({ date: today, limit: 5 }) as Promise<{ bookings: Booking[]; error?: string }>,
          api.getBarberTeam() as Promise<{ barbers: TeamMember[]; error?: string }>
        ]);

        // Handle dashboard stats
        if ('error' in dashboardRes && dashboardRes.error) {
          console.error("Dashboard stats error:", dashboardRes.error);
        } else {
          setStats(dashboardRes as DashboardStats);
        }

        // Handle bookings
        if ('error' in bookingsRes && bookingsRes.error) {
          console.error("Bookings error:", bookingsRes.error);
        } else if (bookingsRes.bookings) {
          setBookings(bookingsRes.bookings);
        }

        // Handle team
        if ('error' in teamRes && teamRes.error) {
          console.error("Team error:", teamRes.error);
        } else if (teamRes.barbers) {
          setTeam(teamRes.barbers);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format time for display
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get current active appointment
  const getAppointmentStatus = (booking: Booking) => {
    const now = new Date();
    const appointmentTime = new Date(`${booking.appointment_date}T${booking.appointment_time}`);
    const endTime = new Date(appointmentTime.getTime() + (booking.total_duration || 30) * 60000);

    if (booking.status === 'completed') return 'completed';
    if (booking.status === 'cancelled') return 'cancelled';
    if (now >= appointmentTime && now <= endTime) return 'active';
    if (now < appointmentTime) return 'upcoming';
    return 'past';
  };

  if (loading) {
    return (
      <>
        <BarberHeader />
        <div className="p-8 flex-1 overflow-y-auto bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted text-sm">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BarberHeader />
        <div className="p-8 flex-1 overflow-y-auto bg-background flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-error">error</span>
            </div>
            <p className="text-foreground font-semibold mb-1">Something went wrong</p>
            <p className="text-muted text-sm mb-5">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  const todayStats = stats?.today || { appointments: 0, revenue: 0, availableSlots: 0, totalSlots: 18 };
  const weekStats = stats?.week || { appointments: 0, revenue: 0, change: 0 };
  const firstName = barber?.name?.split(' ')[0] || 'Barber';
  const bookedSlots = Math.max(todayStats.totalSlots - todayStats.availableSlots, 0);
  const utilisation = todayStats.totalSlots > 0 ? (bookedSlots / todayStats.totalSlots) * 100 : 0;

  return (
    <>
      <BarberHeader />

      <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto bg-background">
        {/* Page heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-black text-foreground tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-sm text-muted mt-1">
              Here&apos;s what&apos;s happening at your studio · {currentDate}
            </p>
          </div>
          <Link
            href="/barbers/walk-in"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-soft hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Appointment
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <div className="group relative overflow-hidden bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-primary/5 group-hover:scale-110 transition-transform duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">calendar_today</span>
                </div>
                {weekStats.change !== 0 && (
                  <span className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] font-semibold ${
                    weekStats.change > 0 ? 'bg-secondary/15 text-secondary' : 'bg-error/15 text-error'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {weekStats.change > 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    {weekStats.change > 0 ? '+' : ''}{weekStats.change}%
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Today&apos;s Appointments</p>
              <h3 className="text-3xl font-headline font-black text-foreground mt-1">{todayStats.appointments}</h3>
              <p className="text-xs text-muted mt-2">{weekStats.appointments} this week</p>
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="group relative overflow-hidden bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-primary/5 group-hover:scale-110 transition-transform duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">Today</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Revenue</p>
              <h3 className="text-3xl font-headline font-black text-foreground mt-1">{formatINR(todayStats.revenue)}</h3>
              <p className="text-xs text-muted mt-2">
                Week total <span className="text-foreground font-semibold">{formatINR(weekStats.revenue)}</span>
              </p>
            </div>
          </div>

          {/* Available Slots */}
          <div className="group relative overflow-hidden bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-secondary/5 group-hover:scale-110 transition-transform duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">event_available</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold bg-secondary/15 text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  {todayStats.availableSlots <= 3 ? 'High demand' : 'Open'}
                </span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Available Slots</p>
              <div className="flex items-end gap-2 mt-1">
                <h3 className="text-3xl font-headline font-black text-foreground">{todayStats.availableSlots}</h3>
                <p className="text-muted text-sm pb-1">/ {todayStats.totalSlots} today</p>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${utilisation}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule + side column */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Timeline */}
          <div className="xl:col-span-8 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-soft">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-headline font-black text-foreground">Today&apos;s Schedule</h2>
                <span className="px-3 py-1 bg-surface-container-high text-[11px] font-semibold uppercase tracking-wider text-primary rounded-full">
                  {currentDate}
                </span>
              </div>
              <Link
                href="/barbers/schedule"
                className="px-4 py-2 bg-card border border-border text-sm font-semibold text-foreground rounded-xl hover:bg-surface-container-high hover:border-primary/40 transition-all duration-200"
              >
                Full Schedule
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-14">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-4xl text-primary">event_upcoming</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">No appointments yet</h3>
                <p className="text-sm text-muted max-w-xs mb-6">
                  Your chair is open for today. Add a walk-in or share your booking link to start filling the schedule.
                </p>
                <Link
                  href="/barbers/walk-in"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  Add Walk-In
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((apt) => {
                  const status = getAppointmentStatus(apt);
                  const isActive = status === 'active';
                  const isCompleted = status === 'completed';
                  const serviceNames = apt.services?.map(s => s.name).join(', ') || 'Service';
                  const totalDuration = apt.services?.reduce((sum, s) => sum + s.duration, 0) || apt.total_duration || 30;

                  return (
                    <div
                      key={apt.id}
                      className={`flex items-center gap-4 rounded-2xl p-4 border transition-all duration-200 ${
                        isActive
                          ? 'bg-secondary/10 border-secondary/30'
                          : isCompleted
                            ? 'bg-surface-container/40 border-transparent opacity-70'
                            : 'bg-surface border-border hover:border-primary/40 hover:shadow-soft'
                      }`}
                    >
                      {/* Time */}
                      <div className="w-16 shrink-0 text-center">
                        <p className={`text-sm font-bold ${isActive ? 'text-secondary' : 'text-foreground'}`}>
                          {formatTime(apt.appointment_time).split(' ')[0]}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted">
                          {formatTime(apt.appointment_time).split(' ')[1]}
                        </p>
                      </div>

                      {/* Avatar */}
                      <div className={`w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${
                        isActive ? 'ring-2 ring-secondary' : 'bg-surface-container-high'
                      }`}>
                        {apt.customer_image ? (
                          <img alt={apt.customer_name} className="w-full h-full object-cover" src={apt.customer_image} />
                        ) : (
                          <span className="material-symbols-outlined text-muted">person</span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-foreground truncate">{apt.customer_name}</h4>
                          {isActive && (
                            <span className="px-1.5 py-0.5 bg-secondary text-on-secondary text-[9px] font-black uppercase rounded animate-pulse shrink-0">
                              Now
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-1.5 py-0.5 bg-surface-container-high text-muted text-[9px] font-black uppercase rounded shrink-0">
                              Done
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted truncate">{serviceNames}</p>
                      </div>

                      {/* Price + duration */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">{formatINR(apt.total_price)}</p>
                        <p className="text-[11px] text-muted">{totalDuration} min</p>
                      </div>

                      <button className="text-muted hover:text-primary transition-colors shrink-0" aria-label="More options">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  );
                })}

                <Link
                  href="/barbers/schedule"
                  className="mt-2 flex items-center justify-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all duration-200"
                >
                  View full schedule
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            )}
          </div>

          {/* Side column */}
          <div className="xl:col-span-4 space-y-6">
            {/* Staff Availability */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-headline font-black text-foreground">Staff Availability</h3>
                <Link href="/barbers/barbers" className="text-xs font-semibold text-primary hover:underline">Manage</Link>
              </div>
              {team.length === 0 ? (
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-2xl text-muted">group</span>
                  </div>
                  <p className="text-sm text-muted">No team members yet</p>
                  <Link href="/barbers/barbers" className="text-xs font-semibold text-primary hover:underline mt-2">Add a barber</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {team.slice(0, 4).map((staff) => {
                    const available = staff.today_bookings === 0;
                    return (
                      <div key={staff.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-high transition-colors duration-200">
                        <div className="relative shrink-0">
                          <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ring-2 ${
                            available ? 'ring-secondary/40' : 'ring-border'
                          } bg-surface-container-high`}>
                            {staff.image_url ? (
                              <img alt={staff.name} className="w-full h-full object-cover" src={staff.image_url} />
                            ) : (
                              <span className="material-symbols-outlined text-muted text-lg">person</span>
                            )}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                            available ? 'bg-secondary' : 'bg-amber-500 dark:bg-amber-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{staff.name}</p>
                          <p className="text-[11px] text-muted">{staff.today_bookings} bookings today</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 ${
                          available ? 'bg-secondary/15 text-secondary' : 'bg-amber-500/15 dark:bg-amber-400/15 text-amber-600 dark:text-amber-500'
                        }`}>
                          {available ? 'Free' : 'Busy'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-soft">
              <h3 className="font-headline font-black text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: "/barbers/walk-in", icon: "person_add", label: "Walk-In" },
                  { href: "/barbers/schedule", icon: "event", label: "Schedule" },
                  { href: "/barbers/services", icon: "content_cut", label: "Services" },
                  { href: "/barbers/analytics", icon: "insights", label: "Analytics" },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <span className="material-symbols-outlined text-primary">{action.icon}</span>
                    </span>
                    <p className="text-xs font-semibold text-foreground">{action.label}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Insight */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary-container/5 rounded-3xl p-6 border border-primary/20">
              <div className="relative z-10">
                <h3 className="font-headline font-black text-foreground mb-1.5">Hi {firstName} 👋</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {todayStats.appointments === 0
                    ? "No appointments booked yet today. Add a walk-in to get the day started."
                    : `You have ${todayStats.appointments} appointments today worth ${formatINR(todayStats.revenue)}.`
                  }
                </p>
                <Link href="/barbers/analytics" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider hover:gap-2.5 transition-all duration-200">
                  View analytics
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
