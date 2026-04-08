"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";

// Types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  title?: string;
  image_url?: string;
  status: string;
  todayBookings: number;
  upcomingBookings: number;
  isCurrentBarber: boolean;
}

const specialtyOptions = ["Fade", "Beard", "Classic", "Razor", "Modern", "Design", "Color", "Texture"];

function BarbersContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBarber, setNewBarber] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    specialties: [] as string[],
    workingHours: { start: "09:00", end: "18:00" },
  });
  const [addingBarber, setAddingBarber] = useState(false);
  const { loading: authLoading, isAuthenticated, barber } = useBarberAuth();
  const router = useRouter();

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getBarberTeam() as { team: TeamMember[]; error?: string };
      
      if (!('error' in result) || !result.error) {
        setTeam(result.team || []);
      }
    } catch (err) {
      console.error("Failed to fetch team:", err);
      setError("Failed to load team data");
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
      fetchTeam();
    }
  }, [isAuthenticated, fetchTeam]);

  const toggleSpecialty = (specialty: string) => {
    setNewBarber(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleAddBarber = async () => {
    if (!newBarber.name || !newBarber.phone || !newBarber.email || !newBarber.password) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setAddingBarber(true);
      setError(null);
      
      // Note: This would require a backend endpoint to add a barber to the studio
      // For now, we'll show a message that this feature requires admin access
      setError("Adding new barbers requires studio admin access. Contact your studio administrator.");
      
    } catch (err) {
      console.error("Failed to add barber:", err);
      setError("Failed to add barber. Please try again.");
    } finally {
      setAddingBarber(false);
    }
  };

  // Calculate barber status based on current bookings
  const getBarberStatus = (member: TeamMember) => {
    if (member.todayBookings > 0) {
      return { status: 'busy', text: 'Busy', color: 'text-yellow-400', dotColor: 'bg-yellow-400' };
    }
    return { status: 'available', text: 'Available', color: 'text-green-400', dotColor: 'bg-green-400' };
  };

  // Calculate queue load percentage based on bookings
  const getQueueLoad = (member: TeamMember) => {
    // Assume max 8 bookings per day is 100% load
    const maxBookings = 8;
    return Math.min(100, Math.round((member.todayBookings / maxBookings) * 100));
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
            <h2 className="font-headline font-black text-2xl tracking-tight text-white">Barber Management</h2>
            <span className="text-[#4D463A] text-sm">
              {team.length} {team.length === 1 ? 'barber' : 'barbers'} in your studio
            </span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold rounded-xl active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Barber
          </button>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <span className="text-red-400">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-[#0E0E0E]">
          {/* Add Barber Form */}
          {showAddForm && (
            <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
              <h3 className="font-headline font-black text-lg text-white mb-6">Add New Barber</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Full Name *</label>
                  <input
                    type="text"
                    value={newBarber.name}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Phone *</label>
                  <input
                    type="tel"
                    value={newBarber.phone}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Email *</label>
                  <input
                    type="email"
                    value={newBarber.email}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none"
                    placeholder="barber@studio.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Password *</label>
                  <input
                    type="password"
                    value={newBarber.password}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none"
                    placeholder="Temporary password"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Working Hours</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="time"
                      value={newBarber.workingHours.start}
                      onChange={(e) => setNewBarber(prev => ({ ...prev, workingHours: { ...prev.workingHours, start: e.target.value } }))}
                      className="flex-1 bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                    />
                    <span className="text-[#4D463A]">to</span>
                    <input
                      type="time"
                      value={newBarber.workingHours.end}
                      onChange={(e) => setNewBarber(prev => ({ ...prev, workingHours: { ...prev.workingHours, end: e.target.value } }))}
                      className="flex-1 bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => toggleSpecialty(specialty)}
                        className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                          newBarber.specialties.includes(specialty)
                            ? "bg-[#E5C487] text-[#402d00] font-bold"
                            : "bg-[#353534]/50 text-[#4D463A] hover:text-white"
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-[#4D463A] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddBarber}
                  disabled={addingBarber}
                  className="px-6 py-3 bg-[#E5C487] text-[#402d00] font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {addingBarber && <div className="w-4 h-4 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin"></div>}
                  Add Barber
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
            </div>
          ) : team.length === 0 ? (
            <div className="bg-[#1C1B1B] rounded-3xl p-12 border border-[#4D463A]/10 text-center">
              <span className="material-symbols-outlined text-6xl text-[#4D463A] mb-4">group_off</span>
              <h3 className="font-headline font-black text-xl text-white mb-2">No Team Members</h3>
              <p className="text-[#4D463A]">You&apos;re the only barber in this studio. Add team members to grow your business!</p>
            </div>
          ) : (
            /* Barbers Grid */
            <div className="grid grid-cols-2 gap-6">
              {team.map((member) => {
                const statusInfo = getBarberStatus(member);
                const queueLoad = getQueueLoad(member);
                
                return (
                  <div 
                    key={member.id} 
                    className={`bg-[#1C1B1B] rounded-3xl p-6 border transition-all ${
                      member.isCurrentBarber 
                        ? 'border-[#E5C487]/40 ring-1 ring-[#E5C487]/20' 
                        : 'border-[#4D463A]/10 hover:border-[#E5C487]/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#E5C487]/30 bg-[#353534]">
                            {member.image_url ? (
                              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#E5C487] font-bold text-xl">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1C1B1B] ${statusInfo.dotColor}`}></span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{member.name}</h3>
                            {member.isCurrentBarber && (
                              <span className="px-2 py-0.5 bg-[#E5C487]/10 text-[#E5C487] text-[10px] uppercase rounded-full">You</span>
                            )}
                          </div>
                          <p className={`text-xs uppercase font-bold ${statusInfo.color}`}>
                            {statusInfo.text}
                          </p>
                          {member.title && (
                            <p className="text-xs text-[#4D463A] mt-1">{member.title}</p>
                          )}
                        </div>
                      </div>
                      <button className="text-[#4D463A] hover:text-[#E5C487] transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-[#353534]/30 rounded-xl p-3">
                        <p className="text-[10px] text-[#4D463A] uppercase">Today&apos;s Load</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-[#353534] h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                queueLoad > 70 ? 'bg-red-400' :
                                queueLoad > 40 ? 'bg-yellow-400' :
                                'bg-green-400'
                              }`}
                              style={{ width: `${queueLoad}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-white font-bold">{member.todayBookings}</span>
                        </div>
                      </div>
                      <div className="bg-[#353534]/30 rounded-xl p-3">
                        <p className="text-[10px] text-[#4D463A] uppercase">Upcoming</p>
                        <p className="text-sm text-white font-bold mt-1">{member.upcomingBookings} bookings</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 space-y-1">
                      {member.phone && (
                        <p className="text-xs text-[#4D463A] flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">phone</span>
                          {member.phone}
                        </p>
                      )}
                      {member.email && (
                        <p className="text-xs text-[#4D463A] flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">mail</span>
                          {member.email}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BarbersManagementPage() {
  return (
    <BarberAuthProvider>
      <BarbersContent />
    </BarberAuthProvider>
  );
}
