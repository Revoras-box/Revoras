"use client";

import Link from "next/link";
import { useState } from "react";
import { useBookings, useProfile } from "@/lib/hooks";
import { api } from "@/lib/api";
import { toast } from "sonner";

// Type definitions
interface Service {
  name: string;
  price: number;
  duration: number;
}

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  status: string;
  total_amount: number;
  confirmation_code?: string;
  studio_name?: string;
  barber_name?: string;
  barber_image?: string;
  services?: Service[];
  reviewed?: boolean;
  rating?: number;
  cancellation_reason?: string;
}

interface Stats {
  totalBookings: number;
  totalSpent: number;
  completedBookings: number;
  loyaltyPoints: number;
}

interface BookingsData {
  bookings?: Booking[];
}

interface ProfileData {
  stats?: Stats;
}

interface ApiErrorShape {
  error?: string;
}

const isApiError = (value: unknown): value is ApiErrorShape =>
  typeof value === "object" && value !== null && "error" in value;

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [cancelling, setCancelling] = useState(false);

  // Fetch bookings based on tab
  const getStatusFilter = () => {
    switch (activeTab) {
      case "upcoming": return "pending,confirmed";
      case "past": return "completed";
      case "cancelled": return "cancelled";
      default: return undefined;
    }
  };

  const { data: bookingsData, loading: bookingsLoading, refetch } = useBookings({ status: getStatusFilter() });
  const { data: profileData } = useProfile();
  
  const typedBookingsData = bookingsData as BookingsData | null;
  const typedProfileData = profileData as ProfileData | null;
  
  const bookings = typedBookingsData?.bookings || [];
  const stats = typedProfileData?.stats || { totalBookings: 0, totalSpent: 0, completedBookings: 0, loyaltyPoints: 0 };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    setCancelling(true);
    try {
      const result = await api.cancelBooking(bookingId, "User requested cancellation");
      if (!isApiError(result) || !result.error) {
        toast.success("Booking cancelled successfully");
        refetch();
      } else {
        toast.error(result.error || "Failed to cancel booking");
      }
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  // Calculate loyalty tier based on points
  const getLoyaltyTier = (points: number) => {
    if (points >= 3000) return { tier: "Platinum", nextTier: "Diamond", pointsToNext: 5000 - points };
    if (points >= 2000) return { tier: "Gold", nextTier: "Platinum", pointsToNext: 3000 - points };
    if (points >= 1000) return { tier: "Silver", nextTier: "Gold", pointsToNext: 2000 - points };
    return { tier: "Bronze", nextTier: "Silver", pointsToNext: 1000 - points };
  };

  const loyalty = getLoyaltyTier(stats.loyaltyPoints);

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: activeTab === "upcoming" ? bookings.length : "..." },
    { id: "past", label: "Past", count: activeTab === "past" ? bookings.length : "..." },
    { id: "cancelled", label: "Cancelled", count: activeTab === "cancelled" ? bookings.length : "..." },
  ] as const;

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { 
      month: "short", day: "numeric", year: "numeric" 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <main className="relative z-10 flex flex-col px-6 pt-20 pb-20 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="font-label text-[10px] uppercase tracking-widest text-[#E5C487]/60 mb-2">Your Journey</p>
          <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter">My Bookings</h1>
        </div>
        <Link
          href="/user/book"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-bold rounded-full hover:shadow-[0_10px_30px_rgba(229,196,135,0.3)] transition-all"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          New Booking
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-[#1a1a1a] p-1.5 rounded-2xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-[#E5C487] text-[#402d00]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id ? "bg-[#402d00]/20" : "bg-white/10"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Loading State */}
          {bookingsLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-[#1a1a1a] rounded-3xl h-40"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">
                {activeTab === "upcoming" ? "event_available" : activeTab === "past" ? "history" : "cancel"}
              </span>
              <p className="text-gray-400">
                {activeTab === "upcoming" 
                  ? "No upcoming bookings" 
                  : activeTab === "past" 
                  ? "No past bookings" 
                  : "No cancelled bookings"}
              </p>
              {activeTab === "upcoming" && (
                <Link 
                  href="/user/discover" 
                  className="inline-block mt-4 px-6 py-3 bg-[#E5C487] text-[#402d00] rounded-full font-bold"
                >
                  Discover Studios
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className={`bg-[#1a1a1a] rounded-3xl p-6 border border-[#4D463A]/20 hover:border-[#E5C487]/30 transition-all group ${
                    booking.status === "cancelled" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Barber Image */}
                    {booking.barber_image && (
                      <div className="relative">
                        <img
                          src={booking.barber_image}
                          alt={booking.barber_name}
                          className="w-24 h-24 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                        {booking.status === "confirmed" && (
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-[#1a1a1a]">
                            <span className="material-symbols-outlined text-white text-sm icon-filled">check</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-headline text-xl font-bold text-white">
                              {booking.services?.map((s: any) => s.name).join(", ") || "Appointment"}
                            </h3>
                            {booking.status === "cancelled" && (
                              <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs font-bold rounded-full">
                                Cancelled
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400">
                            {booking.barber_name && (
                              <>with <span className="text-[#E5C487]">{booking.barber_name}</span> at </>
                            )}
                            {booking.studio_name}
                          </p>
                        </div>
                        <span className={`text-2xl font-bold ${booking.status === "cancelled" ? "text-gray-500 line-through" : "text-[#E5C487]"}`}>
                          ${booking.total_amount}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="font-label text-[9px] uppercase tracking-widest text-gray-500 mb-1">Date</p>
                          <p className="font-semibold text-white">{formatDate(booking.booking_date)}</p>
                        </div>
                        <div>
                          <p className="font-label text-[9px] uppercase tracking-widest text-gray-500 mb-1">Time</p>
                          <p className="font-semibold text-white">{formatTime(booking.start_time)}</p>
                        </div>
                        <div>
                          <p className="font-label text-[9px] uppercase tracking-widest text-gray-500 mb-1">Status</p>
                          <p className="font-semibold text-white capitalize">{booking.status}</p>
                        </div>
                        <div>
                          <p className="font-label text-[9px] uppercase tracking-widest text-gray-500 mb-1">Code</p>
                          <p className="font-semibold text-white font-mono">{booking.confirmation_code}</p>
                        </div>
                      </div>

                      {/* Actions based on status */}
                      {activeTab === "upcoming" && (
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-[#4D463A]/20">
                          <Link
                            href={`/user/confirmation?booking=${booking.id}`}
                            className="px-4 py-2 bg-[#E5C487]/10 text-[#E5C487] rounded-lg text-sm font-semibold hover:bg-[#E5C487]/20 transition-colors flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-lg">qr_code_2</span>
                            View QR
                          </Link>
                          <button className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">edit_calendar</span>
                            Reschedule
                          </button>
                          <button 
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancelling}
                            className="px-4 py-2 text-red-400/70 rounded-lg text-sm font-semibold hover:bg-red-400/10 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-lg">cancel</span>
                            Cancel
                          </button>
                        </div>
                      )}

                      {activeTab === "past" && (
                        <div className="flex items-center justify-between pt-4 border-t border-[#4D463A]/20">
                          {booking.reviewed ? (
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`material-symbols-outlined text-lg ${
                                      i < (booking.rating || 0) ? "text-[#E5C487]" : "text-gray-600"
                                    } icon-filled`}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">Review submitted</span>
                            </div>
                          ) : (
                            <Link
                              href={`/user/review?booking=${booking.id}`}
                              className="px-4 py-2 bg-[#E5C487] text-[#402d00] rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">rate_review</span>
                              Leave Review
                            </Link>
                          )}
                          <button className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">replay</span>
                            Book Again
                          </button>
                        </div>
                      )}

                      {activeTab === "cancelled" && booking.cancellation_reason && (
                        <p className="text-gray-500 text-sm pt-4 border-t border-[#4D463A]/20">
                          Reason: {booking.cancellation_reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Loyalty Stats */}
        <div className="lg:col-span-4">
          <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#4D463A]/20 sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-2xl font-bold">Loyalty Status</h3>
              <div className="px-3 py-1.5 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] rounded-full text-sm font-black">
                {loyalty.tier}
              </div>
            </div>

            {/* Progress to next tier */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progress to {loyalty.nextTier}</span>
                <span className="text-[#E5C487] font-semibold">{Math.max(0, loyalty.pointsToNext)} pts away</span>
              </div>
              <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E5C487] to-[#C8A96E] rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (stats.loyaltyPoints / (stats.loyaltyPoints + Math.max(0, loyalty.pointsToNext))) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{stats.loyaltyPoints} points</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#2a2a2a] rounded-2xl p-4 text-center">
                <span className="material-symbols-outlined text-[#E5C487] text-3xl mb-2 block">calendar_month</span>
                <p className="text-2xl font-bold text-white">{stats.completedBookings}</p>
                <p className="text-xs text-gray-500">Total Visits</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-2xl p-4 text-center">
                <span className="material-symbols-outlined text-green-400 text-3xl mb-2 block">payments</span>
                <p className="text-2xl font-bold text-white">${stats.totalSpent.toFixed(0)}</p>
                <p className="text-xs text-gray-500">Total Spent</p>
              </div>
            </div>

            {/* Perks */}
            <div className="mt-8 space-y-3">
              <p className="font-label text-[9px] uppercase tracking-widest text-gray-500">{loyalty.tier} Perks</p>
              {[
                { icon: "percent", text: loyalty.tier === "Platinum" ? "15% off all services" : loyalty.tier === "Gold" ? "10% off all services" : "5% off all services" },
                { icon: "priority_high", text: "Priority booking" },
                { icon: "local_cafe", text: "Complimentary beverages" },
              ].map((perk, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="material-symbols-outlined text-[#E5C487] text-lg">{perk.icon}</span>
                  {perk.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
