"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface WorkingHour {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

interface Barber {
  id?: string;
  name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  image_url: string;
  specialties: string[];
  is_active: boolean;
  display_order: number;
}

interface StudioSettings {
  barber: {
    id: string;
    name: string;
    email: string;
    phone: string;
    title?: string;
    image_url?: string;
    logo_url?: string;
  };
  studio: {
    id: number;
    name: string;
    description?: string;
    address: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    phone: string;
    email: string;
    image_url?: string;
    logo_url?: string;
    banner_url?: string;
  } | null;
  workingHours: WorkingHour[];
  barbers: Barber[];
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayAbbr  = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ─── Image Upload Hook ────────────────────────────────────────────────────────

function useImageUpload(initialUrl = "") {
  const [preview, setPreview] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/studio/upload-image`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setPreview(data.url);
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  useEffect(() => { setPreview(initialUrl); }, [initialUrl]);

  return { preview, setPreview, uploading, inputRef, handleFile, handleDrop };
}

// ─── Upload Zone Component ────────────────────────────────────────────────────

function UploadZone({
  label, hint, preview, uploading, onFile, onDrop, aspect = "banner",
  children
}: {
  label: string; hint?: string; preview?: string; uploading?: boolean;
  onFile: (f: File) => void; onDrop: (e: React.DragEvent) => void;
  aspect?: "banner" | "logo" | "avatar"; children?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const sizes: Record<string, string> = {
    banner: "h-40 col-span-2",
    logo:   "h-28 w-28",
    avatar: "h-24 w-24 rounded-full",
  };

  return (
    <div className={aspect === "banner" ? "col-span-2 space-y-2" : "space-y-2"}>
      <label className="text-xs text-[#8B7D6B] uppercase tracking-widest block">{label}</label>
      <div
        className={`relative ${sizes[aspect]} rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group
          ${dragging ? "border-[#E5C487] bg-[#E5C487]/5" : "border-[#4D463A]/30 bg-[#2A2927] hover:border-[#4D463A]"}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { setDragging(false); onDrop(e); }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-white text-2xl block">photo_camera</span>
                <span className="text-white text-xs mt-1">Change photo</span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[#4D463A] text-2xl group-hover:text-[#8B7D6B] transition-colors">
              {aspect === "banner" ? "add_photo_alternate" : "person_add"}
            </span>
            <span className="text-[#4D463A] text-xs group-hover:text-[#8B7D6B] transition-colors">
              {hint || "Drop or click to upload"}
            </span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        />
      </div>
      {hint && aspect === "banner" && (
        <p className="text-xs text-[#4D463A]">{hint}</p>
      )}
      {children}
    </div>
  );
}

// ─── Barber Card ──────────────────────────────────────────────────────────────

function BarberCard({
  barber, index, onEdit, onDelete, onToggle
}: {
  barber: Barber; index: number;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
  onToggle: (i: number) => void;
}) {
  return (
    <div className={`relative group flex items-center gap-5 p-5 rounded-2xl border transition-all
      ${barber.is_active
        ? "bg-[#242220] border-[#4D463A]/20 hover:border-[#4D463A]/40"
        : "bg-[#1A1918] border-[#4D463A]/10 opacity-60"}`}>
      {/* Avatar */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#353534] flex-shrink-0">
        {barber.image_url
          ? <img src={barber.image_url} alt={barber.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-[#4D463A]">person</span>
            </div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-white text-sm truncate">{barber.name || "Unnamed Barber"}</p>
          {!barber.is_active && (
            <span className="text-[9px] bg-[#4D463A]/30 text-[#8B7D6B] px-2 py-0.5 rounded-full uppercase tracking-wider">Hidden</span>
          )}
        </div>
        <p className="text-xs text-[#E5C487]/70 truncate">{barber.title || "Barber"}</p>
        {barber.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {barber.specialties.slice(0, 3).map((s) => (
              <span key={s} className="text-[9px] bg-[#353534] text-[#8B7D6B] px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Order badge */}
      <div className="w-7 h-7 rounded-lg bg-[#353534] flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-[#8B7D6B] font-mono">{index + 1}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggle(index)}
          className="p-2 rounded-xl bg-[#353534] text-[#8B7D6B] hover:text-white transition-colors"
          title={barber.is_active ? "Hide from website" : "Show on website"}
        >
          <span className="material-symbols-outlined text-sm">
            {barber.is_active ? "visibility" : "visibility_off"}
          </span>
        </button>
        <button
          onClick={() => onEdit(index)}
          className="p-2 rounded-xl bg-[#353534] text-[#8B7D6B] hover:text-[#E5C487] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
        <button
          onClick={() => onDelete(index)}
          className="p-2 rounded-xl bg-[#353534] text-[#8B7D6B] hover:text-red-400 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    </div>
  );
}

// ─── Barber Modal ─────────────────────────────────────────────────────────────

function BarberModal({
  barber, onSave, onClose
}: {
  barber: Partial<Barber>; onSave: (b: Barber) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<Barber>({
    name: barber.name || "",
    title: barber.title || "",
    bio: barber.bio || "",
    phone: barber.phone || "",
    email: barber.email || "",
    image_url: barber.image_url || "",
    specialties: barber.specialties || [],
    is_active: barber.is_active ?? true,
    display_order: barber.display_order ?? 0,
    id: barber.id,
  });
  const [specialty, setSpecialty] = useState("");
  const avatar = useImageUpload(form.image_url);

  const addSpecialty = () => {
    if (specialty.trim() && !form.specialties.includes(specialty.trim())) {
      setForm(p => ({ ...p, specialties: [...p.specialties, specialty.trim()] }));
      setSpecialty("");
    }
  };

  useEffect(() => {
    setForm(p => ({ ...p, image_url: avatar.preview }));
  }, [avatar.preview]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1C1B1B] rounded-3xl border border-[#4D463A]/20 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#1C1B1B] px-8 pt-8 pb-4 border-b border-[#4D463A]/10 flex items-center justify-between z-10">
          <h3 className="font-headline font-black text-white text-lg">{barber.id ? "Edit Barber" : "Add Barber"}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-[#4D463A] hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Avatar upload */}
          <div className="flex items-start gap-6">
            <div
              className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#2A2927] border-2 border-[#4D463A]/30 flex-shrink-0 cursor-pointer group hover:border-[#4D463A] transition-colors"
              onClick={() => avatar.inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={avatar.handleDrop}
            >
              {avatar.preview
                ? <img src={avatar.preview} alt="Avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[#4D463A] text-xl">person_add</span>
                    <span className="text-[#4D463A] text-[9px]">Photo</span>
                  </div>
              }
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">photo_camera</span>
              </div>
              {avatar.uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
                </div>
              )}
              <input ref={avatar.inputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) avatar.handleFile(f); }} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#2A2927] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                  placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">Title / Role</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#2A2927] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                  placeholder="Senior Barber" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-[#2A2927] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full bg-[#2A2927] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">Bio</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              className="w-full bg-[#2A2927] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none resize-none h-20"
              placeholder="A short bio shown on the website..." />
          </div>

          <div>
            <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">Specialties</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={specialty} onChange={e => setSpecialty(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                className="flex-1 bg-[#2A2927] border border-[#4D463A]/20 rounded-xl px-4 py-2.5 text-white focus:border-[#E5C487] focus:outline-none text-sm"
                placeholder="e.g. Fade, Beard Trim…" />
              <button onClick={addSpecialty} className="px-4 py-2.5 bg-[#E5C487]/10 text-[#E5C487] rounded-xl text-sm hover:bg-[#E5C487]/20 transition-colors">
                Add
              </button>
            </div>
            {form.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.specialties.map((s, i) => (
                  <span key={s} className="flex items-center gap-1.5 text-xs bg-[#353534] text-[#E5C487] px-3 py-1.5 rounded-full">
                    {s}
                    <button onClick={() => setForm(p => ({ ...p, specialties: p.specialties.filter((_, j) => j !== i) }))}
                      className="text-[#8B7D6B] hover:text-white transition-colors">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-[#242220] rounded-xl">
            <div>
              <p className="text-sm text-white font-medium">Show on website</p>
              <p className="text-xs text-[#4D463A] mt-0.5">Visible to customers on the public listing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={() => setForm(p => ({ ...p, is_active: !p.is_active }))} className="sr-only peer" />
              <div className="w-11 h-6 bg-[#4D463A] peer-checked:bg-[#E5C487] rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#1C1B1B] px-8 pb-8 pt-4 border-t border-[#4D463A]/10 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-[#2A2927] text-[#8B7D6B] font-bold rounded-xl hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.name.trim()}
            className="flex-1 py-3 bg-[#E5C487] text-[#402d00] font-bold rounded-xl hover:bg-[#f0d090] transition-colors disabled:opacity-40"
          >
            {barber.id ? "Save Changes" : "Add Barber"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Settings Content ────────────────────────────────────────────────────

function SettingsContent() {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Barbers state
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [editingBarber, setEditingBarber] = useState<{ index: number; data: Partial<Barber> } | null>(null);
  const [savingBarbers, setSavingBarbers] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "", email: "", phone: "", address: "", description: "",
    city: "", state: "", zipCode: "", country: "",
  });

  const [workingHours, setWorkingHours] = useState<Array<{
    dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean;
  }>>([]);

  // Image hooks
  const logoUpload   = useImageUpload();
  const bannerUpload = useImageUpload();

  const { loading: authLoading, isAuthenticated, logout } = useBarberAuth();
  const router = useRouter();

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getBarberStudioSettings() as StudioSettings & { error?: string };
      if (!result.error) {
        setSettings(result);
        setProfileForm({
          name:        result.studio?.name        || result.barber?.name  || "",
          email:       result.studio?.email       || result.barber?.email || "",
          phone:       result.studio?.phone       || result.barber?.phone || "",
          address:     result.studio?.address     || "",
          description: result.studio?.description || "",
          city:        result.studio?.city        || "",
          state:       result.studio?.state       || "",
          zipCode:     result.studio?.zip_code    || "",
          country:     result.studio?.country     || "",
        });
        logoUpload.setPreview(result.studio?.logo_url || result.studio?.image_url || "");
        bannerUpload.setPreview(result.studio?.banner_url || "");
        setBarbers(result.barbers || []);

        const hours = Array.from({ length: 7 }, (_, i) => {
          const existing = result.workingHours?.find(h => h.day_of_week === i);
          return {
            dayOfWeek: i,
            openTime:  existing?.open_time?.slice(0, 5) || "09:00",
            closeTime: existing?.close_time?.slice(0, 5) || "19:00",
            isClosed:  existing?.is_closed ?? (i === 0),
          };
        });
        setWorkingHours(hours);
      }
    } catch (err) {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login-barber");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchSettings();
  }, [isAuthenticated, fetchSettings]);

  // ── Save profile + hours ──────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const result = await api.updateBarberStudioSettings({
        name:        profileForm.name,
        description: profileForm.description || undefined,
        address:     profileForm.address,
        city:        profileForm.city    || undefined,
        state:       profileForm.state   || undefined,
        zipCode:     profileForm.zipCode || undefined,
        country:     profileForm.country || undefined,
        phone:       profileForm.phone,
        email:       profileForm.email,
        imageUrl:    logoUpload.preview   || undefined,
        logoUrl:     logoUpload.preview   || undefined,
        bannerUrl:   bannerUpload.preview || undefined,
        workingHours,
      }) as { error?: string };

      if (result.error) { setError(result.error); }
      else { setSuccess("Settings saved!"); setTimeout(() => setSuccess(null), 3000); }
    } catch {
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // ── Save barbers ──────────────────────────────────────────────────────────
  const handleSaveBarbers = async () => {
    try {
      setSavingBarbers(true);
      setError(null);
      const res = await fetch(`${API_BASE}/studio/${settings?.studio?.id}/barbers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barbers }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else { setSuccess("Barbers saved!"); setTimeout(() => setSuccess(null), 3000); }
    } catch {
      setError("Failed to save barbers.");
    } finally {
      setSavingBarbers(false);
    }
  };

  const toggleDay  = (d: number) => setWorkingHours(p => p.map(h => h.dayOfWeek === d ? { ...h, isClosed: !h.isClosed } : h));
  const updateHours = (d: number, f: "openTime" | "closeTime", v: string) =>
    setWorkingHours(p => p.map(h => h.dayOfWeek === d ? { ...h, [f]: v } : h));

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: "profile",  label: "Studio Profile",  icon: "storefront"     },
    { id: "media",    label: "Banner & Logo",    icon: "photo_library"  },
    { id: "hours",    label: "Working Hours",    icon: "schedule"       },
    { id: "barbers",  label: "Barbers",          icon: "content_cut"    },
    { id: "slots",    label: "Slot Config",      icon: "event_available"},
    { id: "security", label: "Security",         icon: "lock"           },
  ];

  const sortedHours = [...workingHours].sort((a, b) => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    return order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek);
  });

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <BarberSidebar />
      <main className="ml-72 flex-1 min-h-screen flex flex-col">

        {/* Header */}
        <header className="h-20 px-10 flex justify-between items-center bg-[#1C1B1B]/60 backdrop-blur-xl z-40 sticky top-0 border-b border-[#4D463A]/10">
          <div>
            <h2 className="font-headline font-black text-2xl tracking-tight text-white">Shop Settings</h2>
            <p className="text-xs text-[#4D463A] mt-0.5">Manage how your studio appears to customers</p>
          </div>
          {(activeTab === "profile" || activeTab === "media" || activeTab === "hours") && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-[#E5C487] text-[#402d00] font-headline font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving
                ? <><div className="w-4 h-4 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin"></div>Saving…</>
                : <><span className="material-symbols-outlined text-lg">save</span>Save Changes</>
              }
            </button>
          )}
          {activeTab === "barbers" && (
            <button
              onClick={handleSaveBarbers}
              disabled={savingBarbers}
              className="px-6 py-3 bg-[#E5C487] text-[#402d00] font-headline font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {savingBarbers
                ? <><div className="w-4 h-4 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin"></div>Saving…</>
                : <><span className="material-symbols-outlined text-lg">save</span>Save Barbers</>
              }
            </button>
          )}
        </header>

        {/* Toast messages */}
        {success && (
          <div className="mx-8 mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
            <span className="text-green-400 text-sm">{success}</span>
          </div>
        )}
        {error && (
          <div className="mx-8 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400 text-lg">error</span>
            <span className="text-red-400 text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        <div className="p-8 flex-1 bg-[#0E0E0E]">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-8">

              {/* ── Sidebar Nav ─────────────────────────── */}
              <div className="col-span-3">
                <div className="bg-[#1C1B1B] rounded-3xl p-3 border border-[#4D463A]/10 sticky top-28">
                  {/* Studio card */}
                  <div className="p-4 mb-3 rounded-2xl bg-[#242220]">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#353534] mb-3">
                      {logoUpload.preview
                        ? <img src={logoUpload.preview} alt="logo" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg text-[#4D463A]">storefront</span>
                          </div>
                      }
                    </div>
                    <p className="text-sm font-bold text-white truncate">{profileForm.name || "Your Studio"}</p>
                    <p className="text-xs text-[#4D463A] truncate mt-0.5">{profileForm.city || "City"}</p>
                  </div>

                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 text-left
                        ${activeTab === tab.id
                          ? "bg-[#E5C487]/10 text-[#E5C487]"
                          : "text-[#4D463A] hover:text-white hover:bg-[#353534]/30"}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                      <span className="text-sm font-medium">{tab.label}</span>
                      {tab.id === "barbers" && barbers.length > 0 && (
                        <span className="ml-auto text-[10px] bg-[#E5C487]/20 text-[#E5C487] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {barbers.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Content ────────────────────────────── */}
              <div className="col-span-9 space-y-6">

                {/* ── Profile Tab ───────────────────────── */}
                {activeTab === "profile" && (
                  <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-9 h-9 rounded-xl bg-[#E5C487]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#E5C487] text-lg">storefront</span>
                      </div>
                      <div>
                        <h3 className="font-headline font-black text-white">Studio Profile</h3>
                        <p className="text-xs text-[#4D463A]">Basic information shown to customers</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: "Shop Name",      field: "name",    type: "text"  },
                        { label: "Contact Email",  field: "email",   type: "email" },
                        { label: "Phone",          field: "phone",   type: "tel"   },
                        { label: "City",           field: "city",    type: "text"  },
                        { label: "State",          field: "state",   type: "text"  },
                        { label: "ZIP Code",       field: "zipCode", type: "text"  },
                        { label: "Country",        field: "country", type: "text"  },
                      ].map(({ label, field, type }) => (
                        <div key={field}>
                          <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">{label}</label>
                          <input
                            type={type}
                            value={(profileForm as any)[field]}
                            onChange={e => setProfileForm(p => ({ ...p, [field]: e.target.value }))}
                            className="w-full bg-[#242220] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none transition-colors"
                          />
                        </div>
                      ))}
                      <div className="col-span-2">
                        <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">Address</label>
                        <textarea
                          value={profileForm.address}
                          onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))}
                          className="w-full bg-[#242220] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none resize-none h-20 transition-colors"
                          placeholder="123 Main Street, City, State ZIP"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">Studio Description</label>
                        <textarea
                          value={profileForm.description}
                          onChange={e => setProfileForm(p => ({ ...p, description: e.target.value }))}
                          className="w-full bg-[#242220] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none resize-none h-28 transition-colors"
                          placeholder="Tell customers what makes your studio special…"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Media Tab ─────────────────────────── */}
                {activeTab === "media" && (
                  <div className="space-y-6">
                    {/* Banner */}
                    <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-[#E5C487]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#E5C487] text-lg">panorama</span>
                        </div>
                        <div>
                          <h3 className="font-headline font-black text-white">Studio Banner</h3>
                          <p className="text-xs text-[#4D463A]">Hero image shown at the top of your public page</p>
                        </div>
                      </div>
                      <div
                        className={`relative h-52 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group
                          ${bannerUpload.preview ? "border-[#4D463A]/20" : "border-dashed border-[#4D463A]/30 bg-[#242220] hover:border-[#4D463A]"}`}
                        onClick={() => { const i = document.getElementById("banner-input") as HTMLInputElement; i?.click(); }}
                        onDragOver={e => e.preventDefault()}
                        onDrop={bannerUpload.handleDrop}
                      >
                        {bannerUpload.preview ? (
                          <>
                            <img src={bannerUpload.preview} alt="Banner" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                              <div className="flex items-center gap-2 text-white">
                                <span className="material-symbols-outlined text-lg">photo_camera</span>
                                <span className="text-sm font-medium">Change banner</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-[#353534] flex items-center justify-center">
                              <span className="material-symbols-outlined text-2xl text-[#4D463A]">add_photo_alternate</span>
                            </div>
                            <div className="text-center">
                              <p className="text-[#8B7D6B] text-sm">Drop an image here or click to browse</p>
                              <p className="text-[#4D463A] text-xs mt-1">Recommended: 1600 × 500px, max 5MB</p>
                            </div>
                          </div>
                        )}
                        {bannerUpload.uploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
                          </div>
                        )}
                        <input id="banner-input" type="file" accept="image/*" className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) bannerUpload.handleFile(f); }} />
                      </div>
                      {bannerUpload.preview && (
                        <button
                          onClick={() => bannerUpload.setPreview("")}
                          className="mt-3 text-xs text-[#4D463A] hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>Remove banner
                        </button>
                      )}
                    </div>

                    {/* Logo */}
                    <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-[#E5C487]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#E5C487] text-lg">badge</span>
                        </div>
                        <div>
                          <h3 className="font-headline font-black text-white">Studio Logo</h3>
                          <p className="text-xs text-[#4D463A]">Square logo used in listings and the app header</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div
                          className={`relative w-32 h-32 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group flex-shrink-0
                            ${logoUpload.preview ? "border-[#4D463A]/20" : "border-dashed border-[#4D463A]/30 bg-[#242220] hover:border-[#4D463A]"}`}
                          onClick={() => { const i = document.getElementById("logo-input") as HTMLInputElement; i?.click(); }}
                          onDragOver={e => e.preventDefault()}
                          onDrop={logoUpload.handleDrop}
                        >
                          {logoUpload.preview ? (
                            <>
                              <img src={logoUpload.preview} alt="Logo" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-[#4D463A] text-2xl">add_photo_alternate</span>
                              <span className="text-[#4D463A] text-xs text-center px-2">Upload logo</span>
                            </div>
                          )}
                          {logoUpload.uploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
                            </div>
                          )}
                          <input id="logo-input" type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) logoUpload.handleFile(f); }} />
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-white font-medium">Studio Logo</p>
                          <ul className="text-xs text-[#4D463A] space-y-1">
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span>Square format (1:1 ratio)</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span>Minimum 200 × 200px</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span>PNG or JPG, max 2MB</li>
                          </ul>
                          {logoUpload.preview && (
                            <button onClick={() => logoUpload.setPreview("")}
                              className="text-xs text-[#4D463A] hover:text-red-400 transition-colors flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">delete</span>Remove logo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Hours Tab ─────────────────────────── */}
                {activeTab === "hours" && (
                  <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-9 h-9 rounded-xl bg-[#E5C487]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#E5C487] text-lg">schedule</span>
                      </div>
                      <div>
                        <h3 className="font-headline font-black text-white">Working Hours</h3>
                        <p className="text-xs text-[#4D463A]">Set when your studio is open for bookings</p>
                      </div>
                    </div>

                    {/* Quick presets */}
                    <div className="flex gap-2 mb-6">
                      {[
                        { label: "Mon–Fri",  days: [1,2,3,4,5], open: "09:00", close: "18:00" },
                        { label: "Mon–Sat",  days: [1,2,3,4,5,6], open: "09:00", close: "20:00" },
                        { label: "All week", days: [0,1,2,3,4,5,6], open: "09:00", close: "19:00" },
                      ].map(preset => (
                        <button
                          key={preset.label}
                          onClick={() => setWorkingHours(p => p.map(h => ({
                            ...h,
                            isClosed:  !preset.days.includes(h.dayOfWeek),
                            openTime:  preset.open,
                            closeTime: preset.close,
                          })))}
                          className="px-4 py-2 text-xs bg-[#242220] text-[#8B7D6B] rounded-xl hover:bg-[#353534] hover:text-white transition-colors border border-[#4D463A]/20"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {sortedHours.map((day) => (
                        <div
                          key={day.dayOfWeek}
                          className={`flex items-center gap-4 p-4 rounded-2xl transition-all
                            ${day.isClosed ? "bg-[#1A1918] opacity-60" : "bg-[#242220]"}`}
                        >
                          {/* Day label */}
                          <div className="w-16 flex-shrink-0">
                            <p className="text-xs font-bold text-[#8B7D6B] tracking-widest">{dayAbbr[day.dayOfWeek]}</p>
                            <p className="text-sm text-white">{dayNames[day.dayOfWeek]}</p>
                          </div>

                          {/* Toggle */}
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input type="checkbox" checked={!day.isClosed} onChange={() => toggleDay(day.dayOfWeek)} className="sr-only peer" />
                            <div className="w-10 h-5 bg-[#353534] peer-checked:bg-[#E5C487] rounded-full peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                          </label>

                          {/* Time pickers */}
                          {!day.isClosed ? (
                            <div className="flex items-center gap-3 ml-auto">
                              <input
                                type="time"
                                value={day.openTime}
                                onChange={e => updateHours(day.dayOfWeek, "openTime", e.target.value)}
                                className="bg-[#353534] border border-[#4D463A]/20 rounded-xl px-3 py-2 text-white text-sm focus:border-[#E5C487] focus:outline-none"
                              />
                              <span className="text-[#4D463A] text-xs">to</span>
                              <input
                                type="time"
                                value={day.closeTime}
                                onChange={e => updateHours(day.dayOfWeek, "closeTime", e.target.value)}
                                className="bg-[#353534] border border-[#4D463A]/20 rounded-xl px-3 py-2 text-white text-sm focus:border-[#E5C487] focus:outline-none"
                              />
                            </div>
                          ) : (
                            <span className="ml-auto text-xs text-[#4D463A] font-medium tracking-wider">CLOSED</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Barbers Tab ───────────────────────── */}
                {activeTab === "barbers" && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="bg-[#1C1B1B] rounded-3xl px-8 py-6 border border-[#4D463A]/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E5C487]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#E5C487] text-lg">content_cut</span>
                        </div>
                        <div>
                          <h3 className="font-headline font-black text-white">Team Barbers</h3>
                          <p className="text-xs text-[#4D463A]">{barbers.filter(b => b.is_active).length} of {barbers.length} shown on website</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingBarber({ index: -1, data: { is_active: true, specialties: [], display_order: barbers.length } })}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#E5C487] text-[#402d00] font-bold rounded-xl hover:bg-[#f0d090] transition-colors text-sm"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Barber
                      </button>
                    </div>

                    {/* Barber list */}
                    {barbers.length === 0 ? (
                      <div className="bg-[#1C1B1B] rounded-3xl p-16 border border-[#4D463A]/10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#242220] flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl text-[#4D463A]">content_cut</span>
                        </div>
                        <p className="text-white font-bold mb-1">No barbers yet</p>
                        <p className="text-[#4D463A] text-sm mb-6">Add your team so customers can see who they're booking with</p>
                        <button
                          onClick={() => setEditingBarber({ index: -1, data: { is_active: true, specialties: [], display_order: 0 } })}
                          className="px-6 py-3 bg-[#E5C487] text-[#402d00] font-bold rounded-xl text-sm"
                        >
                          Add your first barber
                        </button>
                      </div>
                    ) : (
                      <div className="bg-[#1C1B1B] rounded-3xl p-4 border border-[#4D463A]/10 space-y-2">
                        {barbers.map((b, i) => (
                          <BarberCard
                            key={b.id || i}
                            barber={b}
                            index={i}
                            onEdit={(idx) => setEditingBarber({ index: idx, data: barbers[idx] })}
                            onDelete={(idx) => setBarbers(p => p.filter((_, j) => j !== idx))}
                            onToggle={(idx) => setBarbers(p => p.map((barber, j) => j === idx ? { ...barber, is_active: !barber.is_active } : barber))}
                          />
                        ))}
                      </div>
                    )}

                    {/* Info callout */}
                    <div className="bg-[#1C1B1B] rounded-2xl p-5 border border-[#4D463A]/10 flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#E5C487] text-lg flex-shrink-0 mt-0.5">info</span>
                      <div>
                        <p className="text-sm text-white font-medium">Visibility Control</p>
                        <p className="text-xs text-[#4D463A] mt-1">
                          Only barbers with "Show on website" toggled on will appear in your public listing.
                          Toggle off to temporarily hide a barber without deleting them.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Slots Tab ─────────────────────────── */}
                {activeTab === "slots" && (
                  <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-9 h-9 rounded-xl bg-[#E5C487]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#E5C487] text-lg">event_available</span>
                      </div>
                      <div>
                        <h3 className="font-headline font-black text-white">Slot Configuration</h3>
                        <p className="text-xs text-[#4D463A]">Configure default booking slot settings</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: "Default Slot Duration", options: [["15","15 minutes"],["30","30 minutes"],["45","45 minutes"],["60","60 minutes"]], def: "30" },
                        { label: "Buffer Between Slots",  options: [["0","No buffer"],["5","5 minutes"],["10","10 minutes"],["15","15 minutes"]], def: "0" },
                        { label: "Advance Booking Window",options: [["7","7 days"],["14","14 days"],["30","30 days"],["60","60 days"]], def: "30" },
                        { label: "Minimum Notice",        options: [["0","No minimum"],["1","1 hour"],["2","2 hours"],["24","24 hours"]], def: "2" },
                      ].map(({ label, options, def }) => (
                        <div key={label}>
                          <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">{label}</label>
                          <select defaultValue={def} className="w-full bg-[#242220] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none">
                            {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#4D463A] mt-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">info</span>
                      Slot configuration will be fully activated in a future update.
                    </p>
                  </div>
                )}

                {/* ── Security Tab ──────────────────────── */}
                {activeTab === "security" && (
                  <div className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-9 h-9 rounded-xl bg-[#E5C487]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#E5C487] text-lg">lock</span>
                      </div>
                      <div>
                        <h3 className="font-headline font-black text-white">Security Settings</h3>
                        <p className="text-xs text-[#4D463A]">Manage your account password</p>
                      </div>
                    </div>
                    <div className="space-y-6 max-w-md">
                      {[
                        { label: "Current Password",  placeholder: "••••••••" },
                        { label: "New Password",       placeholder: "••••••••" },
                        { label: "Confirm Password",   placeholder: "••••••••" },
                      ].map(({ label, placeholder }) => (
                        <div key={label}>
                          <label className="text-xs text-[#8B7D6B] uppercase tracking-widest mb-2 block">{label}</label>
                          <input
                            type="password"
                            placeholder={placeholder}
                            className="w-full bg-[#242220] border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                          />
                        </div>
                      ))}
                      <button className="px-6 py-3 bg-[#E5C487] text-[#402d00] font-bold rounded-xl">
                        Update Password
                      </button>
                    </div>

                    <div className="border-t border-[#4D463A]/20 pt-8 mt-8">
                      <h4 className="font-headline font-bold text-white mb-4">Account Actions</h4>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Barber Edit Modal */}
      {editingBarber && (
        <BarberModal
          barber={editingBarber.data}
          onClose={() => setEditingBarber(null)}
          onSave={(updated) => {
            if (editingBarber.index === -1) {
              setBarbers(p => [...p, updated]);
            } else {
              setBarbers(p => p.map((b, i) => i === editingBarber.index ? updated : b));
            }
            setEditingBarber(null);
          }}
        />
      )}
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
