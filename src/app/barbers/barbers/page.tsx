"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.revoras.tech/api";

// Types
interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  image_url?: string;
  status?: string;
  todayBookings?: number;
  today_bookings?: number;
  upcomingBookings?: number;
  upcoming_bookings?: number;
  isCurrentBarber?: boolean;
}

const specialtyOptions = ["Fade", "Beard", "Classic", "Razor", "Modern", "Design", "Color", "Texture"];

function BarbersContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newBarber, setNewBarber] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    title: "",
    imageUrl: "",
    specialties: [] as string[],
    workingHours: { start: "09:00", end: "18:00" },
  });
  const [addingBarber, setAddingBarber] = useState(false);
  const [editingBarber, setEditingBarber] = useState<TeamMember | null>(null);
  const [updatingBarberId, setUpdatingBarberId] = useState<string | null>(null);
  const [uploadingNewImage, setUploadingNewImage] = useState(false);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const newImageInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);
  const [editBarberForm, setEditBarberForm] = useState({
    name: "",
    phone: "",
    email: "",
    title: "",
    imageUrl: "",
  });
  const { loading: authLoading, isAuthenticated } = useBarberAuth();
  const router = useRouter();

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getBarberTeam() as { team?: TeamMember[]; barbers?: TeamMember[]; error?: string };

      if (result.error) {
        setError(result.error);
      } else {
        setTeam(result.team ?? result.barbers ?? []);
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

  const uploadBarberImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API}/studio/upload-image`, formData, {
      validateStatus: () => true,
    });

    const result = response.data as { url?: string; logoUrl?: string; error?: string };

    if (response.status >= 400 || result.error) {
      throw new Error(result.error || "Failed to upload image");
    }

    return result.url || result.logoUrl || null;
  };

  const handleNewImageSelect = async (file: File) => {
    try {
      setUploadingNewImage(true);
      setError(null);
      const imageUrl = await uploadBarberImage(file);
      if (imageUrl) {
        setNewBarber((prev) => ({ ...prev, imageUrl }));
      }
    } catch (err) {
      console.error("Failed to upload new barber image:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingNewImage(false);
    }
  };

  const handleEditImageSelect = async (file: File) => {
    try {
      setUploadingEditImage(true);
      setError(null);
      const imageUrl = await uploadBarberImage(file);
      if (imageUrl) {
        setEditBarberForm((prev) => ({ ...prev, imageUrl }));
      }
    } catch (err) {
      console.error("Failed to upload barber image:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingEditImage(false);
    }
  };

  const handleAddBarber = async () => {
    if (!newBarber.name || !newBarber.phone || !newBarber.password) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setAddingBarber(true);
      setError(null);
      setSuccess(null);

      const result = await api.addBarberToStudio({
        name: newBarber.name.trim(),
        phone: newBarber.phone.trim(),
        email: newBarber.email.trim() || undefined,
        password: newBarber.password,
        title: newBarber.title.trim() || undefined,
        imageUrl: newBarber.imageUrl.trim() || undefined,
        logoUrl: newBarber.imageUrl.trim() || undefined,
        specialties: newBarber.specialties.length > 0 ? newBarber.specialties : undefined,
        workingHours: Array.from({ length: 7 }, (_, dayOfWeek) => ({
          dayOfWeek,
          openTime: newBarber.workingHours.start,
          closeTime: newBarber.workingHours.end,
          isClosed: dayOfWeek === 0,
        })),
      }) as { team?: TeamMember[]; barbers?: TeamMember[]; message?: string; error?: string };

      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess(result.message || "Barber added successfully.");
      setTimeout(() => setSuccess(null), 3000);

      setNewBarber({
        name: "",
        phone: "",
        email: "",
        password: "",
        title: "",
        imageUrl: "",
        specialties: [],
        workingHours: { start: "09:00", end: "18:00" },
      });
      setShowAddForm(false);

      if (result.team || result.barbers) {
        setTeam(result.team ?? result.barbers ?? []);
      } else {
        await fetchTeam();
      }
    } catch (err) {
      console.error("Failed to add barber:", err);
      setError("Failed to add barber. Please try again.");
    } finally {
      setAddingBarber(false);
    }
  };

  const openEditBarber = (member: TeamMember) => {
    setEditingBarber(member);
    setEditBarberForm({
      name: member.name || "",
      phone: member.phone || "",
      email: member.email || "",
      title: member.title || "",
      imageUrl: member.image_url || "",
    });
  };

  const handleUpdateBarber = async () => {
    if (!editingBarber) return;
    if (!editBarberForm.name.trim()) {
      setError("Barber name is required");
      return;
    }

    try {
      setUpdatingBarberId(editingBarber.id);
      setError(null);
      setSuccess(null);

      const result = await api.updateStudioBarber(editingBarber.id, {
        name: editBarberForm.name.trim(),
        phone: editBarberForm.phone.trim() || undefined,
        email: editBarberForm.email.trim() || undefined,
        title: editBarberForm.title.trim() || undefined,
        imageUrl: editBarberForm.imageUrl.trim() || undefined,
        logoUrl: editBarberForm.imageUrl.trim() || undefined,
      }) as { barber?: TeamMember; team?: TeamMember[]; barbers?: TeamMember[]; error?: string; message?: string };

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.team || result.barbers) {
        setTeam(result.team ?? result.barbers ?? []);
      } else if (result.barber) {
        setTeam((prev) => prev.map((member) => (
          member.id === editingBarber.id
            ? { ...member, ...result.barber }
            : member
        )));
      } else {
        setTeam((prev) => prev.map((member) => (
          member.id === editingBarber.id
            ? {
                ...member,
                name: editBarberForm.name,
                phone: editBarberForm.phone || undefined,
                email: editBarberForm.email || undefined,
                title: editBarberForm.title || undefined,
                image_url: editBarberForm.imageUrl || undefined,
              }
            : member
        )));
      }

      setEditingBarber(null);
      setSuccess(result.message || "Barber updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to update barber:", err);
      setError("Failed to update barber details. Please try again.");
    } finally {
      setUpdatingBarberId(null);
    }
  };

  // Calculate barber status based on current bookings
  const getBarberStatus = (member: TeamMember) => {
    const todayBookings = member.todayBookings ?? member.today_bookings ?? 0;
    if (todayBookings > 0) {
      return { status: 'busy', text: 'Busy', color: 'text-yellow-700 dark:text-yellow-400', dotColor: 'bg-yellow-500 dark:bg-yellow-400' };
    }
    return { status: 'available', text: 'Available', color: 'text-green-600 dark:text-green-400', dotColor: 'bg-green-500 dark:bg-green-400' };
  };

  // Calculate queue load percentage based on bookings
  const getQueueLoad = (member: TeamMember) => {
    // Assume max 8 bookings per day is 100% load
    const maxBookings = 8;
    const todayBookings = member.todayBookings ?? member.today_bookings ?? 0;
    return Math.min(100, Math.round((todayBookings / maxBookings) * 100));
  };

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
            <h2 className="font-headline font-black text-2xl tracking-tight text-foreground">Barber Management</h2>
            <span className="text-muted text-sm">
              {team.length} {team.length === 1 ? 'barber' : 'barbers'} in your studio
            </span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-gradient-to-r from-primary-fixed-dim to-primary-container text-primary-foreground font-headline font-bold rounded-xl active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Barber
          </button>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
            <span className="text-red-600 dark:text-red-400">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        {success && (
          <div className="mx-8 mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
            <span className="text-green-600 dark:text-green-400">{success}</span>
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-surface-container-lowest">
          {/* Add Barber Form */}
          {showAddForm && (
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
              <h3 className="font-headline font-black text-lg text-foreground mb-6">Add New Barber</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Full Name *</label>
                  <input
                    type="text"
                    value={newBarber.name}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Phone *</label>
                  <input
                    type="tel"
                    value={newBarber.phone}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Email</label>
                  <input
                    type="email"
                    value={newBarber.email}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                    placeholder="barber@studio.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Title</label>
                  <input
                    type="text"
                    value={newBarber.title}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                    placeholder="Senior Barber"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Password *</label>
                  <input
                    type="password"
                    value={newBarber.password}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                    placeholder="Temporary password"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Barber Logo URL</label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={newBarber.imageUrl}
                      onChange={(e) => setNewBarber(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="flex-1 bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                      placeholder="https://example.com/barber-photo.jpg"
                    />
                    <button
                      onClick={() => newImageInputRef.current?.click()}
                      disabled={uploadingNewImage}
                      className="px-4 py-3 rounded-xl border border-outline-variant/30 text-primary hover:bg-primary-fixed-dim/10 transition-all disabled:opacity-60 flex items-center gap-2"
                    >
                      {uploadingNewImage && <div className="w-4 h-4 border-2 border-primary-fixed-dim/30 border-t-primary rounded-full animate-spin"></div>}
                      <span className="material-symbols-outlined text-sm">upload</span>
                      Upload
                    </button>
                    <input
                      ref={newImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleNewImageSelect(file);
                        e.currentTarget.value = "";
                      }}
                    />
                  </div>
                  {newBarber.imageUrl && (
                    <div className="mt-3 w-20 h-20 rounded-xl overflow-hidden border border-outline-variant/20">
                      <img src={newBarber.imageUrl} alt="New barber preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Working Hours</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="time"
                      value={newBarber.workingHours.start}
                      onChange={(e) => setNewBarber(prev => ({ ...prev, workingHours: { ...prev.workingHours, start: e.target.value } }))}
                      className="flex-1 bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    />
                    <span className="text-muted">to</span>
                    <input
                      type="time"
                      value={newBarber.workingHours.end}
                      onChange={(e) => setNewBarber(prev => ({ ...prev, workingHours: { ...prev.workingHours, end: e.target.value } }))}
                      className="flex-1 bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => toggleSpecialty(specialty)}
                        className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                          newBarber.specialties.includes(specialty)
                            ? "bg-primary-fixed-dim text-primary-foreground font-bold"
                            : "bg-surface-container-highest/50 text-muted hover:text-foreground"
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
                  className="px-6 py-3 text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddBarber}
                  disabled={addingBarber}
                  className="px-6 py-3 bg-primary-fixed-dim text-primary-foreground font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {addingBarber && <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>}
                  Add Barber
                </button>
              </div>
            </div>
          )}
          {editingBarber && (
            <div className="bg-surface-container-low rounded-3xl p-8 border border-primary-fixed-dim/20">
              <h3 className="font-headline font-black text-lg text-foreground mb-6">Edit Barber Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Full Name *</label>
                  <input
                    type="text"
                    value={editBarberForm.name}
                    onChange={(e) => setEditBarberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Title</label>
                  <input
                    type="text"
                    value={editBarberForm.title}
                    onChange={(e) => setEditBarberForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                    placeholder="Senior Barber"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Phone</label>
                  <input
                    type="tel"
                    value={editBarberForm.phone}
                    onChange={(e) => setEditBarberForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Email</label>
                  <input
                    type="email"
                    value={editBarberForm.email}
                    onChange={(e) => setEditBarberForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted uppercase tracking-widest mb-2 block">Barber Logo URL</label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={editBarberForm.imageUrl}
                      onChange={(e) => setEditBarberForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="flex-1 bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none"
                      placeholder="https://example.com/barber-photo.jpg"
                    />
                    <button
                      onClick={() => editImageInputRef.current?.click()}
                      disabled={uploadingEditImage}
                      className="px-4 py-3 rounded-xl border border-outline-variant/30 text-primary hover:bg-primary-fixed-dim/10 transition-all disabled:opacity-60 flex items-center gap-2"
                    >
                      {uploadingEditImage && <div className="w-4 h-4 border-2 border-primary-fixed-dim/30 border-t-primary rounded-full animate-spin"></div>}
                      <span className="material-symbols-outlined text-sm">upload</span>
                      Upload
                    </button>
                    <input
                      ref={editImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleEditImageSelect(file);
                        e.currentTarget.value = "";
                      }}
                    />
                  </div>
                  {editBarberForm.imageUrl && (
                    <div className="mt-3 w-20 h-20 rounded-xl overflow-hidden border border-outline-variant/20">
                      <img src={editBarberForm.imageUrl} alt="Edit barber preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setEditingBarber(null)}
                  className="px-6 py-3 text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBarber}
                  disabled={updatingBarberId === editingBarber.id}
                  className="px-6 py-3 bg-primary-fixed-dim text-primary-foreground font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingBarberId === editingBarber.id && <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>}
                  Save Barber
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary-fixed-dim/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : team.length === 0 ? (
            <div className="bg-surface-container-low rounded-3xl p-12 border border-outline-variant/10 text-center">
              <span className="material-symbols-outlined text-6xl text-muted mb-4">group_off</span>
              <h3 className="font-headline font-black text-xl text-foreground mb-2">No Team Members</h3>
              <p className="text-muted">You&apos;re the only barber in this studio. Add team members to grow your business!</p>
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
                    className={`bg-surface-container-low rounded-3xl p-6 border transition-all ${
                      member.isCurrentBarber 
                        ? 'border-primary-fixed-dim/40 ring-1 ring-primary-fixed-dim/20' 
                        : 'border-outline-variant/10 hover:border-primary-fixed-dim/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary-fixed-dim/30 bg-surface-container-highest">
                            {member.image_url ? (
                              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface-container-low ${statusInfo.dotColor}`}></span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                            {member.isCurrentBarber && (
                              <span className="px-2 py-0.5 bg-primary-fixed-dim/10 text-primary text-[10px] uppercase rounded-full">You</span>
                            )}
                          </div>
                          <p className={`text-xs uppercase font-bold ${statusInfo.color}`}>
                            {statusInfo.text}
                          </p>
                          {member.title && (
                            <p className="text-xs text-muted mt-1">{member.title}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => openEditBarber(member)}
                        className="text-muted hover:text-primary transition-colors flex items-center gap-1 text-xs uppercase"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Edit
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-surface-container-highest/30 rounded-xl p-3">
                        <p className="text-[10px] text-muted uppercase">Today&apos;s Load</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-surface-container-highest h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  queueLoad > 70 ? 'bg-red-500 dark:bg-red-400' :
                                  queueLoad > 40 ? 'bg-yellow-500 dark:bg-yellow-400' :
                                  'bg-green-500 dark:bg-green-400'
                                }`}
                                style={{ width: `${queueLoad}%` }}
                              ></div>
                            </div>
                           <span className="text-xs text-foreground font-bold">{member.todayBookings ?? member.today_bookings ?? 0}</span>
                        </div>
                      </div>
                      <div className="bg-surface-container-highest/30 rounded-xl p-3">
                        <p className="text-[10px] text-muted uppercase">Upcoming</p>
                        <p className="text-sm text-foreground font-bold mt-1">{member.upcomingBookings ?? member.upcoming_bookings ?? 0} bookings</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 space-y-1">
                      {member.phone && (
                        <p className="text-xs text-muted flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">phone</span>
                          {member.phone}
                        </p>
                      )}
                      {member.email && (
                        <p className="text-xs text-muted flex items-center gap-2">
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
