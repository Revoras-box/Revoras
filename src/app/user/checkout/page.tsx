"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { toast } from "sonner";

const paymentMethods = [
  { id: "upi", name: "UPI Transfer", description: "Google Pay, PhonePe, Paytm", icon: "contactless" },
  { id: "card", name: "Debit / Credit Cards", description: "Visa, Mastercard, Amex", icon: "credit_card" },
  { id: "wallet", name: "Digital Wallets", description: "Apple Pay, PayPal", icon: "account_balance" },
];

interface StudioDetails {
  id: string | number;
  name: string;
  city?: string | null;
  state?: string | null;
  image_url?: string | null;
}

interface StudioResponse {
  studio?: StudioDetails;
  error?: string;
}

interface ServiceItem {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface ServicesResponse {
  services?: ServiceItem[];
  error?: string;
}

interface BarberItem {
  id: string;
  name: string;
  title?: string | null;
  image_url?: string | null;
}

interface BarbersResponse {
  barbers?: BarberItem[];
  error?: string;
}

interface BookingResponse {
  message?: string;
  error?: string;
  id?: string | number;
  booking?: {
    id?: string | number;
  };
}

const STUDIO_PLACEHOLDER = "/images/studio-placeholder.jpg";

const parseIdList = (value: string | null): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

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
  return parsed.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

function extractStudio(payload: unknown): StudioDetails | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if ("studio" in obj && obj.studio && typeof obj.studio === "object") {
    return obj.studio as StudioDetails;
  }
  if ("id" in obj && "name" in obj) {
    return obj as unknown as StudioDetails;
  }
  return null;
}

function extractServices(payload: unknown): ServiceItem[] {
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj)) return obj as ServiceItem[];
  if ("services" in obj && Array.isArray(obj.services)) {
    return obj.services as ServiceItem[];
  }
  return [];
}

function extractBarbers(payload: unknown): BarberItem[] {
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj)) return obj as BarberItem[];
  if ("barbers" in obj && Array.isArray(obj.barbers)) {
    return obj.barbers as BarberItem[];
  }
  return [];
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const studioId = searchParams.get("studioId")?.trim() ?? "";
  const barberId = searchParams.get("barberId")?.trim() ?? "";
  const bookingDate = searchParams.get("date")?.trim() ?? "";
  const bookingTimeRaw = searchParams.get("time")?.trim() ?? "";
  const bookingTime = to24HourTime(bookingTimeRaw);
  const selectedServiceIds = useMemo(() => parseIdList(searchParams.get("services")), [searchParams]);
  const noteFromBooking = searchParams.get("notes")?.trim() ?? "";

  const [selectedPayment, setSelectedPayment] = useState("card");
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    promoCode: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: studioData, loading: studioLoading } = useApi<StudioResponse>(
    () => {
      if (!studioId) return Promise.resolve({});
      return api.getStudio(studioId) as Promise<StudioResponse>;
    },
    [studioId]
  );

  const { data: servicesData, loading: servicesLoading } = useApi<ServicesResponse>(
    () => {
      if (!studioId) return Promise.resolve({ services: [] });
      return api.getStudioServices(studioId) as Promise<ServicesResponse>;
    },
    [studioId]
  );

  const { data: barbersData, loading: barbersLoading } = useApi<BarbersResponse>(
    () => {
      if (!studioId) return Promise.resolve({ barbers: [] });
      return api.getStudioBarbers(studioId) as Promise<BarbersResponse>;
    },
    [studioId]
  );

  const studio = useMemo(() => extractStudio(studioData), [studioData]);
  const services = useMemo(() => extractServices(servicesData), [servicesData]);
  const barbers = useMemo(() => extractBarbers(barbersData), [barbersData]);

  const selectedServiceDetails = useMemo(
    () => services.filter((service) => selectedServiceIds.includes(String(service.id))),
    [services, selectedServiceIds]
  );
  const selectedBarber = useMemo(
    () => barbers.find((barber) => barber.id === barberId),
    [barbers, barberId]
  );
  const subtotal = useMemo(
    () => selectedServiceDetails.reduce((sum, service) => sum + service.price, 0),
    [selectedServiceDetails]
  );
  const totalDuration = useMemo(
    () => selectedServiceDetails.reduce((sum, service) => sum + service.duration, 0),
    [selectedServiceDetails]
  );

  const invalidContext = !studioId || !barberId || !bookingDate || !bookingTime || selectedServiceIds.length === 0;
  const loadingSummary = studioLoading || servicesLoading || barbersLoading;
  const backToBookHref = useMemo(() => {
    const params = new URLSearchParams();
    if (studioId) params.set("studioId", studioId);
    if (barberId) params.set("barberId", barberId);
    if (selectedServiceIds.length > 0) params.set("services", selectedServiceIds.join(","));
    const query = params.toString();
    return query ? `/user/book?${query}` : "/user/book";
  }, [studioId, barberId, selectedServiceIds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayAndConfirm = async () => {
    if (invalidContext) {
      toast.error("Missing booking details. Please return and select your slot again.");
      return;
    }
    if (selectedServiceDetails.length === 0) {
      toast.error("Unable to load selected services. Please go back and retry.");
      return;
    }
    if (!selectedBarber) {
      toast.error("Unable to load selected barber. Please go back and retry.");
      return;
    }
    if (!bookingTime) {
      toast.error("Invalid booking time. Please go back and select time again.");
      return;
    }

    setSubmitting(true);
    try {
      const noteParts = [noteFromBooking];
      if (formData.fullName.trim() || formData.mobile.trim()) {
        noteParts.push(`Checkout details: ${formData.fullName.trim()} ${formData.mobile.trim()}`.trim());
      }
      if (formData.promoCode.trim()) {
        noteParts.push(`Promo code: ${formData.promoCode.trim()}`);
      }

      const result = (await api.createBooking({
        studioId: studio?.id || studioId,
        barberId,
        date: bookingDate,
        startTime: bookingTime,
        services: selectedServiceDetails.map((service) => ({
          serviceId: service.id,
          price: service.price,
          duration: service.duration,
        })),
        notes: noteParts.filter(Boolean).join(" | ") || undefined,
        paymentMethod: selectedPayment,
      })) as BookingResponse;

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Booking confirmed successfully.");
      const confirmedBookingId = result.booking?.id ?? result.id;
      if (confirmedBookingId !== undefined && confirmedBookingId !== null) {
        router.push(`/user/confirmation?booking=${encodeURIComponent(String(confirmedBookingId))}`);
      } else {
        router.push("/user/bookings");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  if (invalidContext) {
    return (
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
        <div className="bg-[#1a1a1a] border border-[#4D463A]/20 rounded-3xl p-10 text-center">
          <span className="material-symbols-outlined text-6xl text-[#E5C487]">error</span>
          <h1 className="font-headline text-3xl font-bold text-white mt-4 mb-3">Checkout details are incomplete</h1>
          <p className="text-gray-400 mb-8">Please return to booking and select studio, barber, services, date and time.</p>
          <Link
            href={backToBookHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold"
          >
            Back to Booking
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-[#E5C487] mb-2">Secure Checkout</h1>
        <p className="font-label text-xs tracking-widest text-gray-400 uppercase">Finalize your premium experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Payment Form */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-[#1a1a1a] p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-[#E5C487]/20 scale-150">shield_lock</span>
            </div>
            <h2 className="font-headline text-xl font-bold mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
              Payment Method
            </h2>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`group cursor-pointer p-5 rounded-xl border flex items-center justify-between transition-all ${
                    selectedPayment === method.id
                      ? "border-[#E5C487] bg-[#E5C487]/5"
                      : "border-[#4D463A]/30 bg-[#1e1e1e] hover:border-[#E5C487]/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        selectedPayment === method.id ? "bg-[#E5C487]/20" : "bg-[#2a2a2a]"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          selectedPayment === method.id ? "text-[#E5C487]" : "text-gray-400"
                        }`}
                      >
                        {method.icon}
                      </span>
                    </div>
                    <div>
                      <p className={`font-bold ${selectedPayment === method.id ? "text-[#E5C487]" : "text-white"}`}>
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-400 font-label">{method.description}</p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === method.id ? "border-[#E5C487]" : "border-[#4D463A]/50"
                    }`}
                  >
                    {selectedPayment === method.id && <div className="w-3 h-3 rounded-full bg-[#E5C487]"></div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Form */}
            <div className="mt-12 pt-12 border-t border-[#4D463A]/30 space-y-6">
              <h3 className="font-headline text-lg font-bold">Quick Verification</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="font-label text-[10px] tracking-widest uppercase text-gray-400 mb-1 block">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#4D463A]/50 focus:border-[#E5C487] focus:ring-0 px-0 py-2 font-headline tracking-wide outline-none transition-colors text-white"
                    placeholder="ALEXANDER VANCE"
                    type="text"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] tracking-widest uppercase text-gray-400 mb-1 block">Mobile Number</label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#4D463A]/50 focus:border-[#E5C487] focus:ring-0 px-0 py-2 font-headline tracking-wide outline-none transition-colors text-white"
                    placeholder="+1 (555) 000-0000"
                    type="text"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] tracking-widest uppercase text-gray-400 mb-1 block">Promo Code</label>
                  <input
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#4D463A]/50 focus:border-[#E5C487] focus:ring-0 px-0 py-2 font-headline tracking-wide outline-none transition-colors text-white"
                    placeholder="Optional"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="font-label text-[10px] tracking-widest uppercase">SSL Secured 256-bit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">payments</span>
              <span className="font-label text-[10px] tracking-widest uppercase">Razorpay Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="font-label text-[10px] tracking-widest uppercase">PCI-DSS Compliant</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 sticky top-32">
          <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl">
            {/* Header Image */}
            <div className="h-32 relative">
              <img
                className="w-full h-full object-cover opacity-40"
                src={studio?.image_url || STUDIO_PLACEHOLDER}
                alt="Studio"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
              <div className="absolute bottom-4 left-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#0e0e0e] border border-[#E5C487]/30 flex items-center justify-center p-2">
                  <span className="font-headline font-black text-[#E5C487] text-2xl tracking-tighter">
                    {(studio?.name || "SC").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg">{studio?.name || "Loading..."}</h3>
                  <p className="text-xs text-gray-400 font-label">
                    {[studio?.city, studio?.state].filter(Boolean).join(", ") || "Location unavailable"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-headline font-bold">
                    {selectedServiceDetails.map((service) => service.name).join(", ") || "Selected Services"}
                  </h4>
                  <p className="text-sm text-gray-400">Booking created directly via backend API</p>
                </div>
                <span className="font-headline font-bold text-[#E5C487]">${subtotal}</span>
              </div>

              {/* Booking Details */}
              <div className="bg-[#1a1a1a]/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#E5C487] text-lg">event</span>
                  <span className="text-gray-400 font-medium">{formatDisplayDate(bookingDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#E5C487] text-lg">schedule</span>
                  <span className="text-gray-400 font-medium">
                    {bookingTime ? `${formatDisplayTime(bookingTime)} (${totalDuration} Mins)` : "--"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#E5C487] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    person
                  </span>
                  <span className="text-gray-400 font-medium">
                    {selectedBarber ? `${selectedBarber.title || "Barber"}: ${selectedBarber.name}` : "Loading barber..."}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-6 border-t border-[#4D463A]/30">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service Subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="font-medium capitalize">{selectedPayment}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-[#4D463A]/30">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="font-label text-[10px] tracking-widest uppercase text-gray-400">Total Amount Due</p>
                    <p className="font-headline text-3xl font-black text-[#E5C487]">${subtotal}</p>
                  </div>
                  <div className="bg-green-900/20 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="font-label text-[10px] tracking-widest text-green-400 font-bold uppercase">Locked Rate</span>
                  </div>
                </div>

                <button
                  onClick={handlePayAndConfirm}
                  disabled={submitting || loadingSummary || selectedServiceDetails.length === 0 || !selectedBarber}
                  className="w-full bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold py-4 rounded-xl shadow-lg shadow-[#E5C487]/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  {submitting ? "PROCESSING..." : "PAY & CONFIRM BOOKING"}
                  <span className="material-symbols-outlined text-[#402d00]">arrow_forward</span>
                </button>
                <p className="text-[10px] text-center text-gray-400 font-label mt-4 tracking-tight">
                  By clicking, you agree to our 24h Cancellation Policy.
                </p>
              </div>
            </div>
          </div>

          {/* Queue Position */}
          <div className="mt-6 flex justify-end">
            <div className="bg-[#1e1e1e]/50 backdrop-blur-sm border border-[#4D463A]/20 px-4 py-2 rounded-full flex items-center gap-3">
              <span className="font-label text-[10px] tracking-widest text-gray-400 uppercase">Checkout Status</span>
              <div className="bg-green-900/30 text-green-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                {loadingSummary ? "Loading..." : "Ready"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
