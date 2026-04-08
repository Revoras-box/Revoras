"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";

// Types
interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  category?: string;
}

interface TeamMember {
  id: string;
  name: string;
  image_url?: string;
  today_bookings: number;
  next_available?: string;
}

interface RecentBooking {
  id: string;
  customer_name: string;
  appointment_time: string;
  status: string;
  services: Array<{ name: string }>;
}

function WalkInContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  
  const { barber, loading: authLoading, isAuthenticated } = useBarberAuth();
  const router = useRouter();

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const [servicesRes, teamRes, bookingsRes] = await Promise.all([
        api.getBarberStudioServices() as Promise<{ services: Service[]; error?: string }>,
        api.getBarberTeam() as Promise<{ barbers: TeamMember[]; error?: string }>,
        api.getBarberBookings({ date: today, limit: 5 }) as Promise<{ bookings: RecentBooking[]; error?: string }>
      ]);

      if (servicesRes.services) {
        setServices(servicesRes.services.filter(s => s.price && s.duration));
      }
      if (teamRes.barbers) {
        setTeam(teamRes.barbers);
      }
      if (bookingsRes.bookings) {
        setRecentBookings(bookingsRes.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = services.find(s => s.id === id);
    return sum + (service?.price || 0);
  }, 0);

  const totalDuration = selectedServices.reduce((sum, id) => {
    const service = services.find(s => s.id === id);
    return sum + (service?.duration || 0);
  }, 0);

  // Format time for display
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Submit walk-in booking
  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      setError("Please select at least one service");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const result = await api.createWalkInBooking({
        customerPhone: customerPhone || undefined,
        customerName: customerName || undefined,
        serviceIds: selectedServices,
        notes: notes || undefined,
        assignedBarberId: selectedBarber || undefined
      }) as { booking?: RecentBooking; error?: string; message?: string };

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(`Walk-in booking created! Confirmation: ${(result.booking as { confirmationCode?: string })?.confirmationCode || 'Success'}`);
        // Reset form
        setSelectedBarber(null);
        setSelectedServices([]);
        setCustomerPhone("");
        setCustomerName("");
        setNotes("");
        // Refresh recent bookings
        fetchData();
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      console.error("Failed to create walk-in:", err);
      setError("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <h2 className="font-headline font-black text-2xl tracking-tight text-white">Walk-In Booking</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs text-green-400 uppercase tracking-widest">Queue Open</span>
            </div>
          </div>
        </header>

        {/* Success/Error Messages */}
        {success && (
          <div className="mx-8 mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="text-green-400">{success}</span>
          </div>
        )}
        {error && (
          <div className="mx-8 mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <span className="text-red-400">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        <div className="p-8 flex-1 overflow-y-auto bg-[#0E0E0E]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-8">
              {/* Walk-In Form */}
              <div className="col-span-8 space-y-6">
                {/* Customer Info */}
                <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
                  <h3 className="font-headline font-black text-lg text-white mb-6">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Phone Number</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Name (Optional)</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Select Barber */}
                <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
                  <h3 className="font-headline font-black text-lg text-white mb-6">
                    Select Barber <span className="text-sm text-[#4D463A] font-normal">(Optional - defaults to you)</span>
                  </h3>
                  {team.length === 0 ? (
                    <p className="text-[#4D463A]">No team members available. You will be assigned.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {team.map((member) => {
                        const isAvailable = member.today_bookings < 10; // Simple availability check
                        return (
                          <button
                            key={member.id}
                            onClick={() => isAvailable && setSelectedBarber(member.id === barber?.id ? null : member.id)}
                            disabled={!isAvailable}
                            className={`p-4 rounded-2xl transition-all text-left ${
                              selectedBarber === member.id
                                ? 'bg-[#E5C487]/20 border-2 border-[#E5C487]'
                                : isAvailable
                                ? 'bg-[#353534]/30 border border-[#4D463A]/20 hover:border-[#E5C487]/50'
                                : 'bg-[#353534]/10 border border-[#4D463A]/10 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E5C487]/30 bg-[#353534] flex items-center justify-center">
                                  {member.image_url ? (
                                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="material-symbols-outlined text-[#4D463A]">person</span>
                                  )}
                                </div>
                                <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1C1B1B] ${
                                  isAvailable ? 'bg-green-400' : 'bg-yellow-400'
                                }`}></span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">
                                  {member.name}
                                  {member.id === barber?.id && <span className="text-[#E5C487] ml-1">(You)</span>}
                                </p>
                                <p className={`text-[10px] uppercase ${isAvailable ? 'text-green-400' : 'text-yellow-400'}`}>
                                  {member.today_bookings} bookings today
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Select Services */}
                <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
                  <h3 className="font-headline font-black text-lg text-white mb-6">
                    Select Services <span className="text-red-400">*</span>
                  </h3>
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-4xl text-[#4D463A] mb-2">content_cut</span>
                      <p className="text-[#4D463A]">No services available. Add services first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`p-4 rounded-xl transition-all text-left flex justify-between items-center ${
                            selectedServices.includes(service.id)
                              ? 'bg-[#E5C487]/20 border border-[#E5C487]'
                              : 'bg-[#353534]/30 border border-[#4D463A]/20 hover:border-[#E5C487]/50'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-bold text-white">{service.name}</p>
                            <p className="text-[10px] text-[#4D463A]">{service.duration} min</p>
                          </div>
                          <span className="text-lg font-headline font-black text-[#E5C487]">
                            ${parseFloat(String(service.price)).toFixed(2)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
                  <h3 className="font-headline font-black text-lg text-white mb-4">Special Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none resize-none h-24"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="col-span-4 space-y-6">
                {/* Booking Summary */}
                <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10 sticky top-28">
                  <h3 className="font-headline font-black text-lg text-white mb-6">Booking Summary</h3>
                  
                  {selectedServices.length > 0 ? (
                    <div className="space-y-4">
                      {selectedServices.map(id => {
                        const service = services.find(s => s.id === id);
                        return service ? (
                          <div key={id} className="flex justify-between items-center">
                            <span className="text-sm text-white">{service.name}</span>
                            <span className="text-sm text-[#E5C487]">${parseFloat(String(service.price)).toFixed(2)}</span>
                          </div>
                        ) : null;
                      })}
                      <div className="border-t border-[#4D463A]/20 pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-[#4D463A] uppercase">Duration</span>
                          <span className="text-sm text-white">{totalDuration} min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white">Total</span>
                          <span className="text-2xl font-headline font-black text-[#E5C487]">${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#4D463A] text-sm">Select services to see summary</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={selectedServices.length === 0 || submitting}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">add_task</span>
                        Add to Queue
                      </>
                    )}
                  </button>
                </div>

                {/* Recent Walk-Ins */}
                <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
                  <h3 className="font-headline font-black text-lg text-white mb-4">Recent Walk-Ins</h3>
                  {recentBookings.length === 0 ? (
                    <p className="text-[#4D463A] text-sm">No walk-ins today yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-[#353534]/30 rounded-xl">
                          <div>
                            <p className="text-sm font-bold text-white">{booking.customer_name}</p>
                            <p className="text-[10px] text-[#4D463A]">
                              {booking.services?.map(s => s.name).join(', ') || 'Service'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#4D463A]">{formatTime(booking.appointment_time)}</p>
                            <span className={`text-[10px] uppercase ${
                              booking.status === 'confirmed' ? 'text-green-400' : 
                              booking.status === 'pending' ? 'text-yellow-400' :
                              booking.status === 'completed' ? 'text-[#4D463A]' : 'text-[#4D463A]'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function WalkInPage() {
  return (
    <BarberAuthProvider>
      <WalkInContent />
    </BarberAuthProvider>
  );
}
