"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";

interface BookingService {
  name?: string;
  duration?: number;
}

interface BookingDetails {
  id: string;
  booking_date?: string;
  start_time?: string;
  status?: string;
  confirmation_code?: string;
  studio_name?: string;
  studio_address?: string;
  studio_city?: string;
  studio_state?: string;
  barber_name?: string;
  barber_image?: string;
  barber_title?: string;
  barber_rating?: number;
  services?: BookingService[];
}

interface BookingResponse {
  booking?: BookingDetails;
  error?: string;
}

const DEFAULT_BARBER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBFRTw09ATzddkEkZPI--dLiP7oV5j7rS6xDTVEpHl6XZ3mJ1HVa7mnjjO2KLA72RxuUJhNEjXYoDUtIduvgahBsaLOjHgLgIkea6pwZqQGcdxtHp8Z86QtlJRHXI4r3ZkzPeo-w50UE817K6gKt2q-RJ0VwilKqQwOHg7K2E6xc-2XdtuyeZh3GpDxcaK9mBNkpQ4z5NhHAS0f9OYJYdzlsQxXJH1QMtrV6DhCpQ-kSMoya0E_LLoteq0bVEMchsotHVKij9qwxv8";
const DEFAULT_MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD5Ly9TO7G9ibQSfewG42Wsh11vGVf2vkyLdmN-hu5owa50sVXw_h85b4UaJFuFA5d0i5cHFZfYW9kuHPTnYmjJpbBxrpeMpLeNSdttLayogmsBwVU9imEMGntghlMj7ybfpmvNariTDUB4ef0KKO45XyR9932g4nnEjFxzI_h4_AU_3NPDkTFwu-E70G7SmMnNhAGGX6Du0vRmFXnyVSz1z9i0DOEI94OHeKc9jRHJplvgdgD5briAXR3JBMeVeBuPgqGIaO3xWyo";

const to24HourTime = (raw: string): string | null => {
  const value = raw.trim();
  if (!value) return null;

  const strict24 = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (strict24) {
    const hour = Number(strict24[1]);
    const min = Number(strict24[2]);
    if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
      return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }
  }

  const ampm = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    const hour = Number(ampm[1]);
    const min = Number(ampm[2]);
    const period = ampm[3].toUpperCase();
    if (hour >= 1 && hour <= 12 && min >= 0 && min <= 59) {
      const normalizedHour = period === "PM" ? (hour % 12) + 12 : hour % 12;
      return `${String(normalizedHour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }
  }

  return null;
};

const formatDisplayTime = (time: string): string => {
  const [hoursRaw, minsRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const mins = Number(minsRaw);
  if (Number.isNaN(hours) || Number.isNaN(mins)) return time;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(mins).padStart(2, "0")} ${period}`;
};

const formatDisplayDate = (date: string): string => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const addMinutesToTime = (time: string, minutesToAdd: number): string | null => {
  const normalized = to24HourTime(time);
  if (!normalized) return null;
  const [hourRaw, minuteRaw] = normalized.split(":");
  const base = Number(hourRaw) * 60 + Number(minuteRaw);
  if (Number.isNaN(base)) return null;

  const total = (base + minutesToAdd) % (24 * 60);
  const correctedTotal = total < 0 ? total + 24 * 60 : total;
  const hour = Math.floor(correctedTotal / 60);
  const minute = correctedTotal % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const buildTimeRange = (startTime?: string, durationMinutes = 0): string => {
  if (!startTime) return "Time unavailable";
  const normalizedStart = to24HourTime(startTime);
  if (!normalizedStart) return startTime;
  if (durationMinutes <= 0) return formatDisplayTime(normalizedStart);

  const end = addMinutesToTime(normalizedStart, durationMinutes);
  if (!end) return formatDisplayTime(normalizedStart);
  return `${formatDisplayTime(normalizedStart)} — ${formatDisplayTime(end)}`;
};

const formatStatus = (status?: string): string => {
  if (!status) return "Confirmed";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const getStatusStyles = (status?: string): string => {
  const normalized = status?.toLowerCase();
  if (normalized === "cancelled") return "bg-red-900/30 text-red-400";
  if (normalized === "pending") return "bg-amber-900/30 text-amber-400";
  return "bg-green-900/30 text-green-400";
};

const extractBooking = (payload: unknown): BookingDetails | null => {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;

  if ("booking" in obj && obj.booking && typeof obj.booking === "object") {
    return obj.booking as BookingDetails;
  }

  if ("id" in obj && typeof obj.id === "string") {
    return obj as unknown as BookingDetails;
  }

  return null;
};

function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking")?.trim() ?? "";

  const { data: bookingData, loading, error } = useApi<BookingResponse>(
    () => {
      if (!bookingId) return Promise.resolve({ error: "Booking reference is missing." });
      return api.getBooking(bookingId) as Promise<BookingResponse>;
    },
    [bookingId]
  );

  const booking = useMemo(() => extractBooking(bookingData), [bookingData]);
  const services = booking?.services ?? [];
  const serviceNames = services.map((service) => service.name).filter((name): name is string => Boolean(name));
  const totalDuration = services.reduce((sum, service) => {
    const duration = Number(service.duration ?? 0);
    return sum + (Number.isFinite(duration) ? duration : 0);
  }, 0);

  const serviceTitle = serviceNames.length > 0 ? serviceNames.join(", ") : "Your Appointment";
  const barberName = booking?.barber_name || "Assigned Barber";
  const statusLabel = formatStatus(booking?.status);
  const statusStyles = getStatusStyles(booking?.status);
  const reservationCode = booking?.confirmation_code || booking?.id || bookingId || "--";
  const bookingDate = booking?.booking_date ? formatDisplayDate(booking.booking_date) : "Date unavailable";
  const bookingTime = buildTimeRange(booking?.start_time, totalDuration);
  const locationName = booking?.studio_name || "Studio information unavailable";
  const locationAddress =
    booking?.studio_address ||
    [booking?.studio_city, booking?.studio_state].filter(Boolean).join(", ") ||
    "Address unavailable";
  const reviewBookingId = booking?.id || bookingId;

  const qrPayload = JSON.stringify({
    bookingId: booking?.id || bookingId,
    confirmationCode: reservationCode,
    studio: booking?.studio_name || "",
    date: booking?.booking_date || "",
    time: booking?.start_time || "",
  });
  const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrPayload)}`;

  if (!bookingId) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">
        <div className="bg-[#1a1a1a] border border-[#4D463A]/20 rounded-3xl p-10 text-center max-w-xl w-full">
          <h1 className="font-headline text-3xl font-bold text-[#E5C487] mb-3">Booking reference missing</h1>
          <p className="text-gray-400 mb-8">Open this page from your bookings list to view a real confirmation.</p>
          <Link
            href="/user/bookings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-bold"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E5C487]"></div>
        <p className="text-gray-400 mt-4">Loading confirmation...</p>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">
        <div className="bg-[#1a1a1a] border border-[#4D463A]/20 rounded-3xl p-10 text-center max-w-xl w-full">
          <h1 className="font-headline text-3xl font-bold text-[#E5C487] mb-3">Unable to load confirmation</h1>
          <p className="text-gray-400 mb-8">{error || "This booking could not be found."}</p>
          <Link
            href="/user/bookings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-bold"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-900/20 mb-8 border border-green-500/30 relative">
          <span className="material-symbols-outlined text-green-400 text-6xl" style={{ fontVariationSettings: "'FILL' 0" }}>
            check_circle
          </span>
          <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20"></div>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-[#E5C487] mb-4">Booking Confirmed</h1>
        <p className="font-label text-gray-400 tracking-widest uppercase text-sm">
          Reservation ID: <span className="font-mono text-[#E5C487]/80">{reservationCode}</span>
        </p>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-0 bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-[#4D463A]/20">
        <div className="md:col-span-7 p-10 md:p-12 space-y-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-headline text-3xl font-bold mb-2">{serviceTitle}</h2>
              <p className="text-gray-400 font-medium">
                with <span className="text-[#E5C487] font-bold">{barberName}</span>
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`${statusStyles} text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="font-label text-[10px] uppercase tracking-widest text-gray-500">Date & Time</p>
              <p className="font-semibold text-lg">{bookingDate}</p>
              <p className="text-gray-400">{bookingTime}</p>
            </div>
            <div className="space-y-1">
              <p className="font-label text-[10px] uppercase tracking-widest text-gray-500">Location</p>
              <p className="font-semibold text-lg">{locationName}</p>
              <p className="text-gray-400">{locationAddress}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#4D463A]/30 flex items-center gap-6">
            <img
              alt={barberName}
              className="w-16 h-16 rounded-tl-2xl rounded-br-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
              src={booking.barber_image || DEFAULT_BARBER_IMAGE}
            />
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-gray-500 mb-1">Your Professional</p>
              <p className="font-bold text-[#E5C487]">{barberName}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[#E5C487] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  badge
                </span>
                <span className="text-xs text-gray-400">
                  {booking.barber_title || "Senior Specialist"}
                  {typeof booking.barber_rating === "number" ? ` • ${booking.barber_rating.toFixed(1)} rating` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 bg-[#2a2a2a] relative flex flex-col items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E5C487] to-[#C8A96E] opacity-10 blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#E5C487] to-[#C8A96E] opacity-10 blur-3xl -ml-16 -mb-16"></div>

          <div className="relative z-10 text-center">
            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-xl transform hover:rotate-2 transition-transform cursor-pointer">
              <img alt="Booking QR Code" className="w-40 h-40" src={qrCodeSrc} />
            </div>
            <p className="font-label text-[10px] uppercase tracking-widest text-gray-400 mb-1">Scan at Concierge</p>
            <p className="text-xs text-gray-500 italic">Check-in opens 10 mins prior</p>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-32 overflow-hidden">
            <div className="w-full h-full opacity-30 grayscale contrast-125">
              <img alt="Location preview" className="w-full h-full object-cover" src={DEFAULT_MAP_IMAGE} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="mt-12 w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-6">
        <Link
          href="/user/bookings"
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:shadow-[0_10px_30px_rgba(229,196,135,0.3)] group"
        >
          <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">event_available</span>
          View All Bookings
        </Link>
        <Link
          href={`/user/review?booking=${encodeURIComponent(reviewBookingId)}`}
          className="w-full md:w-auto px-8 py-4 bg-[#1e1e1e] border border-[#4D463A]/30 text-white font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:border-[#E5C487]/40 group"
        >
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">rate_review</span>
          Leave a Review
        </Link>
        <Link
          href="/user"
          className="w-full md:w-auto px-8 py-4 text-[#E5C487] font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:bg-[#E5C487]/5 group"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Home
        </Link>
      </div>

      <p className="mt-16 font-label text-[11px] tracking-widest text-gray-500 uppercase flex items-center gap-2">
        <span className="material-symbols-outlined text-xs">help_outline</span>
        Need assistance? Our concierge is available at{" "}
        <span className="text-[#E5C487]/80 border-b border-[#E5C487]/30 cursor-pointer">+44 20 7946 0123</span>
      </p>
    </main>
  );
}

function ConfirmationPageLoading() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E5C487]"></div>
      <p className="text-gray-400 mt-4">Loading...</p>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationPageLoading />}>
      <ConfirmationPageContent />
    </Suspense>
  );
}
