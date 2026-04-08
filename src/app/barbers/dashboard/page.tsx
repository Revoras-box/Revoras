"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BarberHeader from "@/components/barber/BarberHeader";
import { useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";

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
        <div className="p-8 flex-1 overflow-y-auto bg-[#0E0E0E] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#E5C487] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#4D463A]">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BarberHeader />
        <div className="p-8 flex-1 overflow-y-auto bg-[#0E0E0E] flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#E5C487] text-black rounded-lg font-bold hover:bg-[#d4b377] transition-colors"
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

  return (
    <>
      <BarberHeader />
      
      <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-[#0E0E0E]">
        {/* Hero Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Bookings */}
          <div className="bg-[#1C1B1B] p-6 rounded-2xl relative overflow-hidden group border border-[#4D463A]/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5C487]/5 rounded-bl-full -mr-8 -mt-8"></div>
            <div className="flex flex-col h-full justify-between relative z-10">
              <div>
                <p className="uppercase tracking-widest text-xs text-[#4D463A] mb-2">Today&apos;s Appointments</p>
                <h3 className="text-4xl font-headline font-black text-white">{todayStats.appointments}</h3>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                {weekStats.change !== 0 && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center ${
                    weekStats.change > 0 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    <span className="material-symbols-outlined text-[10px] mr-1">
                      {weekStats.change > 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    {weekStats.change > 0 ? '+' : ''}{weekStats.change}% vs last week
                  </span>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 right-6 opacity-10">
              <span className="material-symbols-outlined text-6xl text-[#E5C487]">calendar_today</span>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-[#1C1B1B] p-6 rounded-2xl relative overflow-hidden group border border-[#4D463A]/10 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E5C487]/5 to-transparent"></div>
            <div className="flex flex-col h-full justify-between relative z-10">
              <div>
                <p className="uppercase tracking-widest text-xs text-[#4D463A] mb-2">Today&apos;s Revenue</p>
                <h3 className="text-4xl font-headline font-black text-[#E5C487]">${todayStats.revenue.toFixed(2)}</h3>
              </div>
              <div className="mt-4">
                <p className="text-[10px] text-[#4D463A] uppercase">
                  Week Total: <span className="text-white">${weekStats.revenue.toFixed(2)}</span>
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 right-6 opacity-10">
              <span className="material-symbols-outlined text-6xl text-[#E5C487]">payments</span>
            </div>
          </div>

          {/* Slots Card */}
          <div className="bg-[#1C1B1B] p-6 rounded-2xl border border-[#4D463A]/10">
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="uppercase tracking-widest text-xs text-[#4D463A] mb-2">Available Slots</p>
                <div className="flex items-end space-x-2">
                  <h3 className="text-4xl font-headline font-black text-green-400">{todayStats.availableSlots}</h3>
                  <p className="text-[#4D463A] text-sm pb-1">/ {todayStats.totalSlots} total</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-[#353534] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-400 h-full rounded-full" 
                    style={{ width: `${((todayStats.totalSlots - todayStats.availableSlots) / todayStats.totalSlots) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-green-400 mt-2 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                  {todayStats.availableSlots <= 3 ? 'High Demand Today' : 'Slots Available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Timeline Section */}
        <section className="grid grid-cols-12 gap-8">
          {/* Timeline */}
          <div className="col-span-8 bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-10 relative z-10">
              <h2 className="text-2xl font-headline font-black text-white flex items-center">
                Daily Schedule
                <span className="ml-4 px-3 py-1 bg-[#353534] text-xs uppercase tracking-widest text-[#E5C487] rounded-full">
                  {currentDate}
                </span>
              </h2>
              <Link 
                href="/barbers/schedule"
                className="px-4 py-2 bg-[#353534] text-sm text-[#E5C487] rounded-lg hover:bg-[#4D463A] transition-colors"
              >
                Full Schedule
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-[#4D463A] mb-4">event_available</span>
                <p className="text-[#4D463A]">No appointments scheduled for today</p>
                <Link 
                  href="/barbers/walk-in"
                  className="mt-4 inline-block px-6 py-2 bg-[#E5C487] text-black rounded-lg font-bold hover:bg-[#d4b377] transition-colors"
                >
                  Add Walk-In
                </Link>
              </div>
            ) : (
              <div className="space-y-1 relative z-10">
                {bookings.map((apt) => {
                  const status = getAppointmentStatus(apt);
                  const isActive = status === 'active';
                  const serviceNames = apt.services?.map(s => s.name).join(', ') || 'Service';
                  const totalDuration = apt.services?.reduce((sum, s) => sum + s.duration, 0) || apt.total_duration || 30;

                  return (
                    <div 
                      key={apt.id}
                      className={`grid grid-cols-12 group cursor-pointer border-l-2 transition-all py-6 items-center ${
                        isActive 
                          ? 'border-green-400' 
                          : status === 'completed' 
                            ? 'border-[#4D463A]/40' 
                            : 'border-[#4D463A]/20 hover:border-[#E5C487]'
                      }`}
                    >
                      <div className="col-span-2 px-6">
                        <p className={`text-sm transition-colors ${
                          isActive 
                            ? 'text-green-400 font-bold' 
                            : status === 'completed'
                              ? 'text-[#4D463A]/50'
                              : 'text-[#4D463A] group-hover:text-[#E5C487]'
                        }`}>
                          {formatTime(apt.appointment_time)}
                        </p>
                      </div>
                      <div className={`col-span-10 flex items-center rounded-2xl p-4 ml-4 transition-all ${
                        isActive
                          ? 'bg-green-400/10 border border-green-400/20 shadow-lg'
                          : status === 'completed'
                            ? 'bg-[#201F1F]/50 opacity-60'
                            : 'bg-[#201F1F] group-hover:bg-[#2A2A2A] border border-transparent hover:border-[#E5C487]/20'
                      }`}>
                        <div className={`w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center ${
                          isActive ? 'border-2 border-green-400 shadow-lg' : 'bg-[#353534]'
                        }`}>
                          {apt.customer_image ? (
                            <img alt={apt.customer_name} className="w-full h-full object-cover" src={apt.customer_image} />
                          ) : (
                            <span className="material-symbols-outlined text-[#4D463A]">person</span>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center">
                            <h4 className="font-bold text-white">{apt.customer_name}</h4>
                            {isActive && (
                              <span className="ml-3 px-2 py-0.5 bg-green-400 text-[8px] font-black uppercase text-black rounded flex items-center animate-pulse">
                                ACTIVE NOW
                              </span>
                            )}
                            {status === 'completed' && (
                              <span className="ml-3 px-2 py-0.5 bg-[#4D463A] text-[8px] font-black uppercase text-white rounded">
                                COMPLETED
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${isActive ? 'text-green-400/70' : 'text-[#4D463A]'}`}>
                            {serviceNames}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-xs text-[#E5C487]/70 px-3 py-1 rounded-full border border-[#E5C487]/20">
                            {totalDuration} MIN
                          </span>
                          <p className="text-sm text-[#E5C487] mt-1 font-bold">${parseFloat(String(apt.total_price)).toFixed(2)}</p>
                        </div>
                        <button className="ml-6 text-[#4D463A] hover:text-[#E5C487] transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {bookings.length > 0 && (
              <Link 
                href="/barbers/schedule"
                className="mt-6 block text-center text-[#E5C487] text-sm hover:underline"
              >
                View Full Schedule →
              </Link>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-8">
            {/* Staff Status Card */}
            <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
              <h3 className="font-headline font-black text-lg text-white mb-6">Staff Availability</h3>
              {team.length === 0 ? (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-4xl text-[#4D463A] mb-2">group</span>
                  <p className="text-[#4D463A] text-sm">No team members found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {team.slice(0, 4).map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full border border-[#E5C487]/30 overflow-hidden flex items-center justify-center bg-[#353534]">
                            {staff.image_url ? (
                              <img alt={staff.name} className="w-full h-full object-cover" src={staff.image_url} />
                            ) : (
                              <span className="material-symbols-outlined text-[#4D463A]">person</span>
                            )}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1C1B1B] ${
                            staff.today_bookings === 0 ? 'bg-green-400' : 'bg-yellow-400'
                          }`}></span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-bold text-white">{staff.name}</p>
                          <p className={`text-[10px] font-bold uppercase ${
                            staff.today_bookings === 0 ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {staff.today_bookings === 0 ? 'Available' : 'Busy'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#4D463A] uppercase">Today</p>
                        <p className="text-xs text-white">{staff.today_bookings} bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link 
                href="/barbers/barbers"
                className="mt-6 block text-center text-[#E5C487] text-sm hover:underline"
              >
                Manage Barbers →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
              <h3 className="font-headline font-black text-lg text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/barbers/walk-in" className="p-4 bg-[#353534]/50 rounded-xl text-center hover:bg-[#E5C487]/10 transition-all group">
                  <span className="material-symbols-outlined text-[#E5C487] text-2xl group-hover:scale-110 transition-transform">person_add</span>
                  <p className="text-xs text-[#4D463A] mt-2 group-hover:text-[#E5C487]">Walk-In</p>
                </Link>
                <Link href="/barbers/schedule" className="p-4 bg-[#353534]/50 rounded-xl text-center hover:bg-[#E5C487]/10 transition-all group">
                  <span className="material-symbols-outlined text-[#E5C487] text-2xl group-hover:scale-110 transition-transform">event</span>
                  <p className="text-xs text-[#4D463A] mt-2 group-hover:text-[#E5C487]">Schedule</p>
                </Link>
                <Link href="/barbers/services" className="p-4 bg-[#353534]/50 rounded-xl text-center hover:bg-[#E5C487]/10 transition-all group">
                  <span className="material-symbols-outlined text-[#E5C487] text-2xl group-hover:scale-110 transition-transform">content_cut</span>
                  <p className="text-xs text-[#4D463A] mt-2 group-hover:text-[#E5C487]">Services</p>
                </Link>
                <Link href="/barbers/analytics" className="p-4 bg-[#353534]/50 rounded-xl text-center hover:bg-[#E5C487]/10 transition-all group">
                  <span className="material-symbols-outlined text-[#E5C487] text-2xl group-hover:scale-110 transition-transform">insights</span>
                  <p className="text-xs text-[#4D463A] mt-2 group-hover:text-[#E5C487]">Analytics</p>
                </Link>
              </div>
            </div>

            {/* Marketing Insight */}
            <div className="bg-[#2A2A2A] rounded-3xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-[#E5C487] font-headline font-black mb-2">Welcome, {barber?.name?.split(' ')[0] || 'Barber'}!</h3>
                <p className="text-sm text-[#9A9A9A] leading-relaxed">
                  {todayStats.appointments === 0 
                    ? "You have no appointments today. Add walk-ins to get started!"
                    : `You have ${todayStats.appointments} appointments today worth $${todayStats.revenue.toFixed(2)}.`
                  }
                </p>
                <Link href="/barbers/analytics" className="mt-4 text-xs font-bold text-[#E5C487] flex items-center hover:translate-x-1 transition-transform">
                  VIEW ANALYTICS <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
