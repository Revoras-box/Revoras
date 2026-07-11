"use client";

import { useState, useEffect, useCallback } from "react";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { TimeOffEntry } from "@/lib/api";
import { formatINR } from "@/lib/format";
import Link from "next/link";

// Types
interface Booking {
  id: string;
  appointment_date: string;
  appointment_time: string;
  barber_id?: string;
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

const timeToMinutes = (time: string | null | undefined) => {
  if (!time) return null;
  const [hourRaw, minuteRaw] = time.split(":");
  const hours = Number(hourRaw);
  const minutes = Number(minuteRaw);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const rangesOverlap = (startA: number, endA: number, startB: number, endB: number) =>
  startA < endB && startB < endA;

function ScheduleContent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [timeOff, setTimeOff] = useState<TimeOffEntry[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [removingBlockId, setRemovingBlockId] = useState<string | null>(null);
  const { barber, loading: authLoading, isAuthenticated, isStudioOwner } = useBarberAuth();
  const router = useRouter();

  // Block-time modal state
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    barberId: "",
    isFullDay: false,
    startTime: "09:00",
    endTime: "10:00",
    reason: "",
  });
  const [blockSaving, setBlockSaving] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);

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

      const [bookingsRes, teamRes, timeOffRes] = await Promise.all([
        api.getBarberBookings({ date: dateStr, limit: 50 }) as Promise<{ bookings: Booking[]; error?: string }>,
        api.getBarberTeam() as Promise<{ barbers: TeamMember[]; error?: string }>,
        api.getBarberTimeOff({ date: dateStr }) as Promise<{ timeOff: TimeOffEntry[]; error?: string }>
      ]);

      if (bookingsRes.bookings) {
        setBookings(bookingsRes.bookings);
      }
      if (teamRes.barbers) {
        setTeam(teamRes.barbers);
      }
      if (timeOffRes.timeOff) {
        setTimeOff(timeOffRes.timeOff);
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

  // Default the block-time form's barber once the team has loaded
  useEffect(() => {
    if (!blockForm.barberId) {
      const defaultBarberId = isStudioOwner ? team[0]?.id : barber?.id;
      if (defaultBarberId) {
        setBlockForm((prev) => ({ ...prev, barberId: String(defaultBarberId) }));
      }
    }
  }, [team, isStudioOwner, barber, blockForm.barberId]);

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

  const teamById = new Map(team.map((member) => [String(member.id), member]));
  const barberName = (id?: string) => (id ? teamById.get(String(id))?.name : undefined);

  const visibleBookings = bookings.filter(
    (b) => selectedBarberId === "all" || String(b.barber_id) === selectedBarberId
  );
  const visibleTimeOff = timeOff.filter(
    (t) => selectedBarberId === "all" || String(t.barber_id) === selectedBarberId
  );

  const fullDayBlocks = visibleTimeOff.filter((t) => t.is_full_day);
  const partialBlocks = visibleTimeOff.filter((t) => !t.is_full_day);

  // Get bookings overlapping a specific time slot (a slot is treated as 30 min wide)
  const getBookingsForSlot = (time: string) => {
    return visibleBookings.filter((b) => b.appointment_time.slice(0, 5) === time);
  };

  // Get blocked-time entries overlapping a specific time slot
  const getBlocksForSlot = (time: string) => {
    const slotStart = timeToMinutes(time);
    const slotEnd = (slotStart ?? 0) + 30;
    return partialBlocks.filter((t) => {
      const start = timeToMinutes(t.start_time);
      const end = timeToMinutes(t.end_time);
      if (start === null || end === null || slotStart === null) return false;
      return rangesOverlap(slotStart, slotEnd, start, end);
    });
  };

  const openBlockModal = () => {
    setBlockError(null);
    setBlockForm((prev) => ({
      ...prev,
      barberId: prev.barberId || (isStudioOwner ? team[0]?.id : barber?.id) || "",
    }));
    setBlockModalOpen(true);
  };

  const submitBlock = async () => {
    setBlockError(null);
    if (!isStudioOwner && !barber?.id) {
      setBlockError("Could not determine your barber profile.");
      return;
    }
    if (isStudioOwner && !blockForm.barberId) {
      setBlockError("Select a team member.");
      return;
    }
    if (!blockForm.isFullDay && blockForm.startTime >= blockForm.endTime) {
      setBlockError("End time must be after start time.");
      return;
    }

    setBlockSaving(true);
    try {
      const result = await api.createBarberTimeOff({
        barberId: isStudioOwner ? blockForm.barberId : undefined,
        date: selectedDate.toISOString().split('T')[0],
        isFullDay: blockForm.isFullDay,
        startTime: blockForm.isFullDay ? undefined : `${blockForm.startTime}:00`,
        endTime: blockForm.isFullDay ? undefined : `${blockForm.endTime}:00`,
        reason: blockForm.reason,
      }) as { error?: string };

      if (result.error) {
        setBlockError(result.error);
        return;
      }

      setBlockModalOpen(false);
      setBlockForm((prev) => ({ ...prev, reason: "", isFullDay: false }));
      fetchData();
    } catch (err) {
      setBlockError(err instanceof Error ? err.message : "Failed to block time");
    } finally {
      setBlockSaving(false);
    }
  };

  const removeBlock = async (id: string) => {
    try {
      setRemovingBlockId(id);
      await api.deleteBarberTimeOff(id);
      setTimeOff((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to remove blocked time:", err);
    } finally {
      setRemovingBlockId(null);
    }
  };

  // Calculate stats
  const totalBookings = visibleBookings.filter(b => b.status !== 'cancelled').length;
  const availableSlots = timeSlots.length - totalBookings;
  const projectedRevenue = visibleBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + parseFloat(String(b.total_price)), 0);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-fixed-dim/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest text-foreground">
      <BarberSidebar />
      <main className="lg:ml-72 flex-1 min-h-screen flex flex-col">
        <header className="h-20 pl-16 pr-6 lg:px-10 flex justify-between items-center bg-surface-container-low/60 backdrop-blur-xl z-40 sticky top-0">
          <div className="flex items-center gap-8">
            <h2 className="font-headline font-black text-2xl tracking-tight text-foreground">Schedule</h2>
            {/* Day Selector */}
            <div className="flex gap-2 p-1 bg-surface-container-lowest rounded-full">
              {weekDays.map((d, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const newDate = new Date(d.fullDate);
                    setSelectedDate(newDate);
                  }}
                  className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                    d.active
                      ? "bg-primary-fixed-dim text-primary-foreground font-bold"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {d.day} {d.date}
                </button>
              ))}
            </div>
            {/* Team filter */}
            {team.length > 1 && (
              <select
                value={selectedBarberId}
                onChange={(e) => setSelectedBarberId(e.target.value)}
                className="bg-surface-container-lowest text-xs uppercase tracking-widest text-muted rounded-full px-4 py-2 border border-outline-variant/20 focus:outline-none focus:border-primary"
              >
                <option value="all">All Staff</option>
                {team.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openBlockModal}
              className="px-4 py-2 bg-surface-container-highest text-primary font-bold rounded-lg text-sm hover:bg-surface-bright transition-colors border border-primary-fixed-dim/30"
            >
              + Block Time
            </button>
            <Link
              href="/barbers/walk-in"
              className="px-4 py-2 bg-primary-fixed-dim text-primary-foreground font-bold rounded-lg text-sm hover:bg-primary-fixed-dim transition-colors"
            >
              + Walk-In
            </Link>
          </div>
        </header>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-surface-container-lowest">
          {loading ? (
            <div className="bg-surface-container-low rounded-3xl p-12 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary-fixed-dim/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Full-day block banners */}
              {fullDayBlocks.length > 0 && (
                <div className="space-y-2">
                  {fullDayBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="bg-surface-container-highest/40 border border-outline-variant/30 rounded-2xl px-6 py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-muted">block</span>
                        <p className="text-sm text-foreground">
                          <span className="font-bold">{barberName(block.barber_id) || "Barber"}</span> is unavailable all day
                          {block.reason ? ` — ${block.reason}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => removeBlock(block.id)}
                        disabled={removingBlockId === block.id}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                      >
                        {removingBlockId === block.id ? "..." : "Remove"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Timeline Grid */}
              <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline font-bold text-lg">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></span> Active
                    </span>
                    <span className="px-3 py-1 bg-primary-fixed-dim/20 text-primary text-xs rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span> Confirmed
                    </span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 dark:bg-yellow-400"></span> Pending
                    </span>
                    <span className="px-3 py-1 bg-outline-variant/20 text-muted text-xs rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-outline-variant"></span> Blocked
                    </span>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  {timeSlots.map((time) => {
                    const slotBookings = getBookingsForSlot(time);
                    const slotBlocks = getBlocksForSlot(time);
                    const showTeamTag = selectedBarberId === "all" && team.length > 1;

                    return (
                      <div
                        key={time}
                        className="grid gap-4 items-start"
                        style={{ gridTemplateColumns: '80px 1fr' }}
                      >
                        <div className="text-xs text-muted py-2 text-right pr-4">
                          {formatTime(time)}
                        </div>
                        <div className="space-y-2">
                          {slotBookings.map((booking) => {
                            const isActive = booking.status === 'confirmed' &&
                              new Date() >= new Date(`${booking.appointment_date}T${booking.appointment_time}`);

                            return (
                              <div
                                key={booking.id}
                                className={`rounded-xl p-4 transition-all ${
                                  isActive || booking.status === 'active'
                                    ? 'bg-green-500/20 border border-green-500/30'
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-500/20 border border-yellow-500/30'
                                    : booking.status === 'completed'
                                    ? 'bg-surface-container-highest/30 border border-outline-variant/20 opacity-60'
                                    : booking.status === 'cancelled'
                                    ? 'bg-red-500/10 border border-red-500/20 opacity-50'
                                    : 'bg-surface-container-highest/50 border border-primary-fixed-dim/30'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden">
                                      {booking.customer_image ? (
                                        <img src={booking.customer_image} alt={booking.customer_name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="material-symbols-outlined text-muted">person</span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-bold text-foreground">
                                        {booking.customer_name}
                                        {showTeamTag && barberName(booking.barber_id) && (
                                          <span className="ml-2 text-[10px] font-normal text-primary/70">
                                            with {barberName(booking.barber_id)}
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-xs text-muted">
                                        {booking.services?.map(s => s.name).join(', ') || 'Service'}
                                      </p>
                                      {booking.notes && (
                                        <p className="text-[10px] text-primary mt-1">{booking.notes}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <p className="text-sm font-bold text-primary">
                                        {formatINR(booking.total_price)}
                                      </p>
                                      <p className="text-[10px] text-muted">
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
                                            className="px-3 py-1 bg-primary-fixed-dim text-black text-xs font-bold rounded-lg hover:bg-primary-fixed-dim disabled:opacity-50"
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
                                          className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30 disabled:opacity-50"
                                        >
                                          No Show
                                        </button>
                                      </div>
                                    )}
                                    {booking.status === 'completed' && (
                                      <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg">
                                        ✓ Completed
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {slotBlocks.map((block) => (
                            <div
                              key={block.id}
                              className="h-12 rounded-xl bg-outline-variant/10 border border-outline-variant/30 flex items-center justify-between px-4"
                            >
                              <p className="text-xs text-muted">
                                <span className="material-symbols-outlined text-xs align-middle mr-1">block</span>
                                {showTeamTag && barberName(block.barber_id) ? `${barberName(block.barber_id)} unavailable` : "Unavailable"}
                                {block.reason ? ` — ${block.reason}` : ""}
                              </p>
                              <button
                                onClick={() => removeBlock(block.id)}
                                disabled={removingBlockId === block.id}
                                className="text-[10px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                              >
                                {removingBlockId === block.id ? "..." : "Remove"}
                              </button>
                            </div>
                          ))}

                          {slotBookings.length === 0 && slotBlocks.length === 0 && (
                            <div className="h-12 border border-dashed border-outline-variant/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-surface-container-highest/30 transition-all group">
                              <Link href="/barbers/walk-in" className="flex items-center gap-2 text-muted/50 group-hover:text-primary">
                                <span className="material-symbols-outlined text-sm">add</span>
                                <span className="text-xs">Add Appointment</span>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Bar */}
              <div className="bg-surface-container-low rounded-2xl p-6 flex justify-between items-center border border-outline-variant/10">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] text-muted uppercase mb-1">Today&apos;s Bookings</p>
                    <p className="text-2xl font-headline font-black text-foreground">{totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase mb-1">Available Slots</p>
                    <p className="text-2xl font-headline font-black text-green-600 dark:text-green-400">{availableSlots}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase mb-1">Projected Revenue</p>
                    <p className="text-2xl font-headline font-black text-primary">{formatINR(projectedRevenue)}</p>
                  </div>
                </div>
                <Link
                  href="/barbers/walk-in"
                  className="px-6 py-3 bg-gradient-to-r from-primary-fixed-dim to-primary-container text-primary-foreground font-headline font-bold rounded-xl active:scale-95 transition-all flex items-center"
                >
                  <span className="material-symbols-outlined mr-2 text-sm">add</span>
                  New Appointment
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Block Time Modal */}
      {blockModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low rounded-2xl p-6 w-full max-w-md border border-outline-variant/20">
            <h3 className="font-headline font-bold text-lg mb-4">
              Block Time — {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </h3>

            {isStudioOwner && team.length > 1 && (
              <div className="mb-4">
                <label className="text-xs text-muted uppercase tracking-wide block mb-1">Team Member</label>
                <select
                  value={blockForm.barberId}
                  onChange={(e) => setBlockForm((prev) => ({ ...prev, barberId: e.target.value }))}
                  className="w-full bg-surface-container-lowest text-foreground text-sm rounded-lg px-3 py-2 border border-outline-variant/20 focus:outline-none focus:border-primary"
                >
                  {team.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            )}

            <label className="flex items-center gap-2 mb-4 text-sm text-foreground">
              <input
                type="checkbox"
                checked={blockForm.isFullDay}
                onChange={(e) => setBlockForm((prev) => ({ ...prev, isFullDay: e.target.checked }))}
                className="accent-primary-fixed-dim"
              />
              Block the entire day
            </label>

            {!blockForm.isFullDay && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-muted uppercase tracking-wide block mb-1">Start</label>
                  <input
                    type="time"
                    value={blockForm.startTime}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-surface-container-lowest text-foreground text-sm rounded-lg px-3 py-2 border border-outline-variant/20 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-wide block mb-1">End</label>
                  <input
                    type="time"
                    value={blockForm.endTime}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-surface-container-lowest text-foreground text-sm rounded-lg px-3 py-2 border border-outline-variant/20 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs text-muted uppercase tracking-wide block mb-1">Reason (optional)</label>
              <input
                type="text"
                value={blockForm.reason}
                onChange={(e) => setBlockForm((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Lunch break, appointment, day off..."
                className="w-full bg-surface-container-lowest text-foreground text-sm rounded-lg px-3 py-2 border border-outline-variant/20 focus:outline-none focus:border-primary"
              />
            </div>

            {blockError && <p className="text-xs text-red-600 dark:text-red-400 mb-4">{blockError}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setBlockModalOpen(false)}
                className="flex-1 py-2 rounded-lg border border-outline-variant/30 text-sm text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitBlock}
                disabled={blockSaving}
                className="flex-1 py-2 rounded-lg bg-primary-fixed-dim text-primary-foreground font-bold text-sm hover:bg-primary-fixed-dim disabled:opacity-50"
              >
                {blockSaving ? "Saving..." : "Block Time"}
              </button>
            </div>
          </div>
        </div>
      )}
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
