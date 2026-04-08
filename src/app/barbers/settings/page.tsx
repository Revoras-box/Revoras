"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";

// Types
interface WorkingHour {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

interface StudioSettings {
  barber: {
    id: string;
    name: string;
    email: string;
    phone: string;
    title?: string;
    image_url?: string;
  };
  studio: {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    image_url?: string;
  } | null;
  workingHours: WorkingHour[];
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function SettingsContent() {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [workingHours, setWorkingHours] = useState<Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>>([]);
  
  const { barber, loading: authLoading, isAuthenticated, logout } = useBarberAuth();
  const router = useRouter();

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getBarberStudioSettings() as StudioSettings & { error?: string };
      
      if (!('error' in result) || !result.error) {
        setSettings(result);
        
        // Initialize profile form
        setProfileForm({
          name: result.studio?.name || result.barber?.name || "",
          email: result.studio?.email || result.barber?.email || "",
          phone: result.studio?.phone || result.barber?.phone || "",
          address: result.studio?.address || ""
        });
        
        // Initialize working hours (ensure all 7 days)
        const hours = [];
        for (let i = 0; i < 7; i++) {
          const existing = result.workingHours?.find(h => h.day_of_week === i);
          hours.push({
            dayOfWeek: i,
            openTime: existing?.open_time?.slice(0, 5) || "09:00",
            closeTime: existing?.close_time?.slice(0, 5) || "19:00",
            isClosed: existing?.is_closed ?? (i === 0) // Sunday closed by default
          });
        }
        setWorkingHours(hours);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
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
      fetchSettings();
    }
  }, [isAuthenticated, fetchSettings]);

  // Save settings
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const result = await api.updateBarberStudioSettings({
        name: profileForm.name,
        address: profileForm.address,
        phone: profileForm.phone,
        email: profileForm.email,
        workingHours
      }) as { error?: string; message?: string };

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Settings saved successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Toggle day open/closed
  const toggleDay = (dayOfWeek: number) => {
    setWorkingHours(prev => prev.map(h => 
      h.dayOfWeek === dayOfWeek ? { ...h, isClosed: !h.isClosed } : h
    ));
  };

  // Update hours for a day
  const updateHours = (dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) => {
    setWorkingHours(prev => prev.map(h => 
      h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
    ));
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: "person" },
    { id: "hours", label: "Working Hours", icon: "schedule" },
    { id: "slots", label: "Slot Config", icon: "event_available" },
    { id: "security", label: "Security", icon: "lock" },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <BarberSidebar />
      <main className="ml-72 flex-1 min-h-screen flex flex-col">
        <header className="h-20 px-10 flex justify-between items-center bg-[#1C1B1B]/60 backdrop-blur-xl z-40 sticky top-0">
          <div className="flex items-center gap-8">
            <h2 className="font-headline font-black text-2xl tracking-tight text-white">Shop Settings</h2>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#E5C487] text-[#402d00] font-headline font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
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
              {/* Sidebar Tabs */}
              <div className="col-span-3">
                <div className="bg-[#1C1B1B] rounded-3xl p-4 border border-[#4D463A]/10">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? "bg-[#E5C487]/10 text-[#E5C487]"
                          : "text-[#4D463A] hover:text-white hover:bg-[#353534]/30"
                      }`}
                    >
                      <span className="material-symbols-outlined">{tab.icon}</span>
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="col-span-9 space-y-6">
                {activeTab === "profile" && (
                  <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                    <h3 className="font-headline font-black text-lg text-white mb-6">Shop Profile</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-[#353534] flex items-center justify-center overflow-hidden">
                          {settings?.studio?.image_url || settings?.barber?.image_url ? (
                            <img 
                              src={settings?.studio?.image_url || settings?.barber?.image_url} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-4xl text-[#4D463A]">storefront</span>
                          )}
                        </div>
                        <div>
                          <button className="px-4 py-2 bg-[#E5C487] text-[#402d00] font-bold text-xs uppercase rounded-lg">
                            Upload Logo
                          </button>
                          <p className="text-xs text-[#4D463A] mt-2">PNG, JPG up to 2MB</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Shop Name</label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Contact Email</label>
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Phone</label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Barber Name</label>
                          <input
                            type="text"
                            value={barber?.name || ''}
                            disabled
                            className="w-full bg-[#353534]/30 border border-[#4D463A]/10 rounded-xl px-4 py-3 text-[#4D463A] cursor-not-allowed"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Address</label>
                          <textarea
                            value={profileForm.address}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none resize-none h-20"
                            placeholder="123 Main Street, City, State ZIP"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "hours" && (
                  <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                    <h3 className="font-headline font-black text-lg text-white mb-6">Working Hours</h3>
                    <div className="space-y-4">
                      {workingHours.sort((a, b) => {
                        // Sort so Monday is first (1,2,3,4,5,6,0 -> Sunday last)
                        const order = [1, 2, 3, 4, 5, 6, 0];
                        return order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek);
                      }).map((day) => (
                        <div key={day.dayOfWeek} className="flex items-center justify-between p-4 bg-[#353534]/30 rounded-xl">
                          <div className="flex items-center gap-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={!day.isClosed} 
                                onChange={() => toggleDay(day.dayOfWeek)}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-[#4D463A] peer-checked:bg-[#E5C487] rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                            <span className={`text-sm font-medium ${!day.isClosed ? 'text-white' : 'text-[#4D463A]'}`}>
                              {dayNames[day.dayOfWeek]}
                            </span>
                          </div>
                          {!day.isClosed ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={day.openTime}
                                onChange={(e) => updateHours(day.dayOfWeek, 'openTime', e.target.value)}
                                className="bg-[#353534] border border-[#4D463A]/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#E5C487] focus:outline-none"
                              />
                              <span className="text-[#4D463A]">to</span>
                              <input
                                type="time"
                                value={day.closeTime}
                                onChange={(e) => updateHours(day.dayOfWeek, 'closeTime', e.target.value)}
                                className="bg-[#353534] border border-[#4D463A]/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#E5C487] focus:outline-none"
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-[#4D463A]">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "slots" && (
                  <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                    <h3 className="font-headline font-black text-lg text-white mb-6">Slot Configuration</h3>
                    <p className="text-[#4D463A] mb-6">Configure default booking slot settings for your studio.</p>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Default Slot Duration</label>
                        <select className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none">
                          <option value="15">15 minutes</option>
                          <option value="30" selected>30 minutes</option>
                          <option value="45">45 minutes</option>
                          <option value="60">60 minutes</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Buffer Between Slots</label>
                        <select className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none">
                          <option value="0" selected>No buffer</option>
                          <option value="5">5 minutes</option>
                          <option value="10">10 minutes</option>
                          <option value="15">15 minutes</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Advance Booking Window</label>
                        <select className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none">
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="30" selected>30 days</option>
                          <option value="60">60 days</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Minimum Notice</label>
                        <select className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none">
                          <option value="0">No minimum</option>
                          <option value="1">1 hour</option>
                          <option value="2" selected>2 hours</option>
                          <option value="24">24 hours</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#4D463A] mt-4">
                      Note: Slot configuration settings will be available in a future update.
                    </p>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                    <h3 className="font-headline font-black text-lg text-white mb-6">Security Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">New Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Confirm Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                          />
                        </div>
                      </div>
                      <button className="px-6 py-3 bg-[#E5C487] text-[#402d00] font-bold rounded-xl active:scale-95 transition-all">
                        Update Password
                      </button>

                      <div className="border-t border-[#4D463A]/20 pt-6 mt-6">
                        <h4 className="font-headline font-bold text-white mb-4">Account Actions</h4>
                        <div className="flex gap-4">
                          <button
                            onClick={logout}
                            className="px-6 py-3 bg-red-500/10 text-red-400 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <BarberAuthProvider>
      <SettingsContent />
    </BarberAuthProvider>
  );
}
