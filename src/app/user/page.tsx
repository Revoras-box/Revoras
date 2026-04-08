"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useBookings, useStudios, useProfile } from "@/lib/hooks";

// Type definitions
interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  status: string;
  studio_name?: string;
  studio_image?: string;
  barber_name?: string;
}

interface Studio {
  id: number;
  name: string;
  city?: string;
  state?: string;
  rating?: number;
  image_url?: string;
  amenities?: string[];
}

interface Stats {
  loyaltyPoints?: number;
  completedBookings?: number;
  totalBookings?: number;
  totalSpent?: number;
}

interface BookingsData {
  bookings?: Booking[];
}

interface StudiosData {
  studios?: Studio[];
}

interface ProfileData {
  stats?: Stats;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const { data: bookingsData, loading: bookingsLoading } = useBookings({ status: "pending,confirmed", limit: "1" });
  const { data: studiosData, loading: studiosLoading } = useStudios({ limit: "4", sortBy: "rating" });
  const { data: profileData } = useProfile();

  const typedBookingsData = bookingsData as BookingsData | null;
  const typedStudiosData = studiosData as StudiosData | null;
  const typedProfileData = profileData as ProfileData | null;

  const upcomingBooking = typedBookingsData?.bookings?.[0];
  const recommendedStudios = typedStudiosData?.studios?.slice(0, 2) || [];
  const stats = typedProfileData?.stats || {};

  // Calculate loyalty tier
  const getLoyaltyTier = (points: number = 0) => {
    if (points >= 3000) return "Diamond";
    if (points >= 2000) return "Platinum";
    if (points >= 1000) return "Gold";
    return "Silver";
  };

  const formatBookingDate = (booking: Booking) => {
    if (!booking) return "";
    const date = new Date(booking.booking_date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [hours, minutes] = booking.start_time.split(":");
    const h = parseInt(hours);
    const time = `${h % 12 || 12}:${minutes} ${h >= 12 ? "PM" : "AM"}`;

    if (date.toDateString() === today.toDateString()) return `Today, ${time}`;
    if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${time}`;
    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
  };

  return (
    <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-12">
      {/* Header */}
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-label text-xs tracking-widest text-gray-400 uppercase">
              Welcome Back • {new Date().toLocaleDateString("en-US", { weekday: "long" })}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter text-white mb-4">
            Welcome back, <span className="text-[#E5C487] italic">{user?.name?.split(" ")[0] || "Guest"}</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md font-body leading-relaxed">
            Your signature look is waiting. We've curated the best availability for you.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/user/bookings"
            className="h-32 w-48 rounded-xl overflow-hidden bg-[#1a1a1a] relative group"
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#E5C487]/20 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <span className="font-label text-[10px] text-[#E5C487] tracking-widest uppercase">My Status</span>
              <span className="font-headline font-bold text-sm text-white">{getLoyaltyTier(stats.loyaltyPoints)} Member</span>
              <span className="text-xs text-gray-400 mt-1">{stats.completedBookings || 0} visits</span>
            </div>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Upcoming Booking */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold tracking-tight">Upcoming Booking</h2>
              <Link href="/user/bookings" className="text-[#E5C487] font-label text-xs tracking-widest uppercase hover:underline">
                View History
              </Link>
            </div>
            
            {bookingsLoading ? (
              <div className="bg-[#1a1a1a] rounded-xl p-8 animate-pulse h-48"></div>
            ) : upcomingBooking ? (
              <div className="bg-[#1a1a1a] rounded-xl p-1 flex flex-col md:flex-row overflow-hidden">
                <div className="md:w-1/3 h-64 md:h-auto overflow-hidden rounded-lg bg-[#2a2a2a]">
                  {upcomingBooking.studio_image && (
                    <img alt={upcomingBooking.studio_name} className="w-full h-full object-cover" src={upcomingBooking.studio_image} />
                  )}
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline text-2xl font-bold">{upcomingBooking.studio_name}</h3>
                      <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-[10px] font-label font-bold tracking-tighter uppercase">
                        {upcomingBooking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 font-body mb-6">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span className="text-sm">{formatBookingDate(upcomingBooking)}</span>
                      </div>
                      {upcomingBooking.barber_name && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">person</span>
                          <span className="text-sm">with {upcomingBooking.barber_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href="/user/bookings"
                      className="flex-1 bg-[#2a2a2a] text-white px-6 py-3 rounded-xl font-headline font-bold text-xs tracking-tight hover:bg-[#3a3a3a] transition-colors text-center"
                    >
                      Manage Booking
                    </Link>
                    <button className="p-3 rounded-xl border border-[#4D463A]/30 text-[#E5C487] hover:bg-[#E5C487]/10 transition-colors">
                      <span className="material-symbols-outlined">directions</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#1a1a1a] rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-600 mb-4 block">event_available</span>
                <h3 className="font-headline text-xl font-bold mb-2">No Upcoming Bookings</h3>
                <p className="text-gray-400 mb-6">Ready for a fresh look?</p>
                <Link
                  href="/user/discover"
                  className="inline-block bg-[#E5C487] text-[#402d00] px-6 py-3 rounded-xl font-bold"
                >
                  Discover Studios
                </Link>
              </div>
            )}
          </section>

          {/* Recommended Studios */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold tracking-tight">Recommended for You</h2>
              <Link href="/user/discover" className="text-[#E5C487] font-label text-xs tracking-widest uppercase hover:underline">
                View All
              </Link>
            </div>
            
            {studiosLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 rounded-xl bg-[#1a1a1a] mb-4"></div>
                    <div className="h-6 bg-[#1a1a1a] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#1a1a1a] rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recommendedStudios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedStudios.map((studio) => (
                  <Link key={studio.id} href={`/user/studio/${studio.id}`} className="group cursor-pointer">
                    <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-[#1a1a1a]">
                      {studio.image_url && (
                        <img
                          alt={studio.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={studio.image_url}
                        />
                      )}
                      <div className="absolute top-4 left-4 bg-[#131313]/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#E5C487] text-xs icon-filled">star</span>
                        <span className="text-xs font-bold font-label text-white">{studio.rating || "New"}</span>
                      </div>
                    </div>
                    <h4 className="font-headline text-xl font-bold mb-1">{studio.name}</h4>
                    <p className="text-gray-400 text-sm">{studio.city}, {studio.state}</p>
                    {studio.amenities && studio.amenities.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {studio.amenities.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="font-label text-[10px] text-gray-400 uppercase tracking-widest px-2 py-0.5 rounded border border-[#4D463A]/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No studios available yet</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          {/* Quick Actions */}
          <section>
            <h2 className="font-headline text-2xl font-bold tracking-tight mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/user/discover"
                className="flex items-center gap-4 p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
              >
                <span className="material-symbols-outlined text-[#E5C487]">explore</span>
                <span className="font-semibold">Find Nearby Studios</span>
              </Link>
              <Link
                href="/user/book"
                className="flex items-center gap-4 p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
              >
                <span className="material-symbols-outlined text-[#E5C487]">calendar_add_on</span>
                <span className="font-semibold">Book Appointment</span>
              </Link>
              <Link
                href="/user/bookings"
                className="flex items-center gap-4 p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
              >
                <span className="material-symbols-outlined text-[#E5C487]">history</span>
                <span className="font-semibold">Booking History</span>
              </Link>
            </div>
          </section>

          {/* VIP Card */}
          <div className="bg-linear-to-br from-[#1a1a1a] to-[#0e0e0e] p-8 rounded-2xl border border-[#4D463A]/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-[#E5C487]">workspace_premium</span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4 relative z-10">VIP Priority Access</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed relative z-10">
              Unlock last-minute cancellations and exclusive slots at top-rated studios.
            </p>
            <Link
              href="/user/bookings"
              className="w-full bg-[#E5C487] text-[#402d00] py-3 rounded-xl font-headline font-black text-xs tracking-widest uppercase relative z-10 block text-center"
            >
              View Perks
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}