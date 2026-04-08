"use client";

import { useState, useEffect, useCallback } from "react";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

// Types
interface Booking {
  id: string;
  appointment_date: string;
  appointment_time: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_image?: string;
  total_price: number;
  total_duration?: number;
  status: string;
  services: Array<{ id: number; name: string; price: number; duration: number }>;
  notes?: string;
}

interface TeamMember {
  id: string;
  name: string;
  image_url?: string;
  title?: string;
}

function ScheduleContent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { barber, loading: authLoading, isAuthenticated } = useBarberAuth();
  const router = useRouter();

  // Generate week days from selected date
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
        active: date.toDateString() === selectedDate.toDateString()
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Time slots from 9 AM to 6 PM
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const [bookingsRes, teamRes] = await Promise.all([
        api.getBarberBookings({ date: dateStr, limit: 50 }) as Promise<{ bookings: Booking[]; error?: string }>,
        api.getBarberTeam() as Promise<{ barbers: TeamMember[]; error?: string }>
      ]);

      if (bookingsRes.bookings) {
        setBookings(bookingsRes.bookings);
      }
      if (teamRes.barbers) {
        setTeam(teamRes.barbers);
      }
    } catch (err) {
      console.error("Failed to fetch schedule:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login-barber");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Update booking status
  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdating(bookingId);
      const result = await api.updateBarberBookingStatus(bookingId, newStatus) as { error?: string };
      if (!result.error) {
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: newStatus } : b
        ));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(null);
    }
  };

  // Get booking for a specific time slot
  const getBookingForSlot = (time: string) => {
    return bookings.find(b => {
      const bookingTime = b.appointment_time.slice(0, 5);
      return bookingTime === time;
    });
  };

  // Calculate stats
  const totalBookings = bookings.filter(b => b.status !== 'cancelled').length;
  const availableSlots = timeSlots.length - totalBookings;
  const projectedRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + parseFloat(String(b.total_price)), 0);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <BarberSidebar />
      <main className="ml-72 flex-1 min-h-screen flex flex-col">
        <header className="h-20 px-10 flex justify-between items-center bg-[#1C1B1B]/60 backdrop-blur-xl z-40 sticky top-0">
          <div className="flex items-center gap-8">
            <h2 className="font-headline font-black text-2xl tracking-tight text-white">Schedule</h2>
            {/* Day Selector */}
            <div className="flex gap-2 p-1 bg-[#0E0E0E] rounded-full">
              {weekDays.map((d, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const newDate = new Date(d.fullDate);
                    setSelectedDate(newDate);
                  }}
                  className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                    d.active
                      ? "bg-[#E5C487] text-[#402d00] font-bold"
                      : "text-[#4D463A] hover:text-[#E5C487]"
                  }`}
                >
                  {d.day} {d.date}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/barbers/walk-in"
              className="px-4 py-2 bg-[#E5C487] text-[#402d00] font-bold rounded-lg text-sm hover:bg-[#d4b377] transition-colors"
            >
              + Walk-In
            </Link>
          </div>
        </header>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-[#0E0E0E]">
          {loading ? (
            <div className="bg-[#1C1B1B] rounded-3xl p-12 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Timeline Grid */}
              <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline font-bold text-lg">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span> Active
                    </span>
                    <span className="px-3 py-1 bg-[#E5C487]/20 text-[#E5C487] text-xs rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#E5C487]"></span> Confirmed
                    </span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Pending
                    </span>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  {timeSlots.map((time) => {
                    const booking = getBookingForSlot(time);
                    const isActive = booking?.status === 'confirmed' && 
                      new Date() >= new Date(`${booking.appointment_date}T${booking.appointment_time}`);
                    
                    return (
                      <div 
                        key={time}
                        className="grid gap-4 items-center"
                        style={{ gridTemplateColumns: '80px 1fr' }}
                      >
                        <div className="text-xs text-[#4D463A] py-2 text-right pr-4">
                          {formatTime(time)}
                        </div>
                        {booking ? (
                          <div
                            className={`rounded-xl p-4 transition-all ${
                              isActive || booking.status === 'active'
                                ? 'bg-green-500/20 border border-green-500/30'
                                : booking.status === 'pending'
                                ? 'bg-yellow-500/20 border border-yellow-500/30'
                                : booking.status === 'completed'
                                ? 'bg-[#353534]/30 border border-[#4D463A]/20 opacity-60'
                                : booking.status === 'cancelled'
                                ? 'bg-red-500/10 border border-red-500/20 opacity-50'
                                : 'bg-[#353534]/50 border border-[#E5C487]/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#353534] flex items-center justify-center overflow-hidden">
                                  {booking.customer_image ? (
                                    <img src={booking.customer_image} alt={booking.customer_name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="material-symbols-outlined text-[#4D463A]">person</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-white">{booking.customer_name}</p>
                                  <p className="text-xs text-[#4D463A]">
                                    {booking.services?.map(s => s.name).join(', ') || 'Service'}
                                  </p>
                                  {booking.notes && (
                                    <p className="text-[10px] text-[#E5C487] mt-1">{booking.notes}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-sm font-bold text-[#E5C487]">
                                    ${parseFloat(String(booking.total_price)).toFixed(2)}
                                  </p>
                                  <p className="text-[10px] text-[#4D463A]">
                                    {booking.total_duration || booking.services?.reduce((s, sv) => s + sv.duration, 0) || 30} min
                                  </p>
                                </div>
                                {/* Status Actions */}
                                {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                  <div className="flex gap-2">
                                    {booking.status === 'pending' && (
                                      <button
                                        onClick={() => updateStatus(booking.id, 'confirmed')}
                                        disabled={updating === booking.id}
                                        className="px-3 py-1 bg-[#E5C487] text-black text-xs font-bold rounded-lg hover:bg-[#d4b377] disabled:opacity-50"
                                      >
                                        {updating === booking.id ? '...' : 'Confirm'}
                                      </button>
                                    )}
                                    <button
                                      onClick={() => updateStatus(booking.id, 'completed')}
                                      disabled={updating === booking.id}
                                      className="px-3 py-1 bg-green-500 text-black text-xs font-bold rounded-lg hover:bg-green-400 disabled:opacity-50"
                                    >
                                      {updating === booking.id ? '...' : 'Complete'}
                                    </button>
                                    <button
                                      onClick={() => updateStatus(booking.id, 'no_show')}
                                      disabled={updating === booking.id}
                                      className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30 disabled:opacity-50"
                                    >
                                      No Show
                                    </button>
                                  </div>
                                )}
                                {booking.status === 'completed' && (
                                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg">
                                    ✓ Completed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="h-12 border border-dashed border-[#4D463A]/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#353534]/30 transition-all group"
                          >
                            <Link href="/barbers/walk-in" className="flex items-center gap-2 text-[#4D463A]/50 group-hover:text-[#E5C487]">
                              <span className="material-symbols-outlined text-sm">add</span>
                              <span className="text-xs">Add Appointment</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Bar */}
              <div className="bg-[#1C1B1B] rounded-2xl p-6 flex justify-between items-center border border-[#4D463A]/10">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] text-[#4D463A] uppercase mb-1">Today&apos;s Bookings</p>
                    <p className="text-2xl font-headline font-black text-white">{totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4D463A] uppercase mb-1">Available Slots</p>
                    <p className="text-2xl font-headline font-black text-green-400">{availableSlots}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4D463A] uppercase mb-1">Projected Revenue</p>
                    <p className="text-2xl font-headline font-black text-[#E5C487]">${projectedRevenue.toFixed(2)}</p>
                  </div>
                </div>
                <Link 
                  href="/barbers/walk-in"
                  className="px-6 py-3 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold rounded-xl active:scale-95 transition-all flex items-center"
                >
                  <span className="material-symbols-outlined mr-2 text-sm">add</span>
                  New Appointment
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <BarberAuthProvider>
      <ScheduleContent />
    </BarberAuthProvider>
  );
}
