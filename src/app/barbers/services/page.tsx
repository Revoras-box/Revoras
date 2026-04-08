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
  description?: string;
  price: number;
  duration: number;
  category: string;
  image_url?: string;
  is_active: boolean;
}

interface GroupedServices {
  [category: string]: Service[];
}

const categoryIcons: { [key: string]: string } = {
  "General": "content_cut",
  "Haircuts": "content_cut",
  "Beard": "face",
  "Premium": "auto_awesome",
  "Shaves": "spa",
  "Combos": "style",
  "Design": "brush"
};

function ServicesContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [grouped, setGrouped] = useState<GroupedServices>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "30",
    category: "General",
    description: "",
  });
  const { loading: authLoading, isAuthenticated } = useBarberAuth();
  const router = useRouter();

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getBarberStudioServices() as { 
        services: Service[]; 
        grouped: GroupedServices;
        error?: string 
      };
      
      if (result.services) {
        setServices(result.services);
        setGrouped(result.grouped || {});
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
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
      fetchServices();
    }
  }, [isAuthenticated, fetchServices]);

  // Get unique categories
  const categories = [
    { id: "all", label: "All Services", icon: "apps" },
    ...Object.keys(grouped).map(cat => ({
      id: cat,
      label: cat,
      icon: categoryIcons[cat] || "category"
    }))
  ];

  // Filter services
  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) return;

    try {
      setSaving(true);
      
      if (editingService) {
        // Update existing service
        const result = await api.updateBarberService(editingService.id, {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration)
        }) as { service?: Service; error?: string };
        
        if (result.service) {
          setServices(prev => prev.map(s => s.id === editingService.id ? result.service! : s));
        }
      } else {
        // Create new service
        const result = await api.createBarberService({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration)
        }) as { service?: Service; error?: string };
        
        if (result.service) {
          setServices(prev => [...prev, result.service!]);
        }
      }
      
      // Reset form
      setFormData({ name: "", price: "", duration: "30", category: "General", description: "" });
      setShowAddForm(false);
      setEditingService(null);
      fetchServices();
    } catch (err) {
      console.error("Failed to save service:", err);
    } finally {
      setSaving(false);
    }
  };

  // Toggle service active status
  const toggleServiceStatus = async (service: Service) => {
    try {
      const result = await api.updateBarberService(service.id, {
        isActive: !service.is_active
      }) as { service?: Service; error?: string };
      
      if (!result.error) {
        setServices(prev => prev.map(s => 
          s.id === service.id ? { ...s, is_active: !s.is_active } : s
        ));
      }
    } catch (err) {
      console.error("Failed to toggle service:", err);
    }
  };

  // Delete service
  const deleteService = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const result = await api.deleteBarberService(serviceId) as { error?: string };
      if (!result.error) {
        setServices(prev => prev.filter(s => s.id !== serviceId));
      }
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  // Edit service
  const startEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: String(service.price),
      duration: String(service.duration),
      category: service.category,
      description: service.description || ""
    });
    setShowAddForm(true);
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
            <h2 className="font-headline font-black text-2xl tracking-tight text-white">Service Catalog</h2>
          </div>
          <button
            onClick={() => {
              setEditingService(null);
              setFormData({ name: "", price: "", duration: "30", category: "General", description: "" });
              setShowAddForm(!showAddForm);
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold rounded-xl active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Service
          </button>
        </header>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-[#0E0E0E]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Category Filter */}
              <div className="flex gap-3 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#E5C487] text-[#402d00] font-bold"
                        : "bg-[#1C1B1B] text-[#4D463A] hover:text-white border border-[#4D463A]/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                    <span className="text-xs uppercase tracking-widest">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Add/Edit Service Form */}
              {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-[#1C1B1B] rounded-3xl p-8 border border-[#4D463A]/10">
                  <h3 className="font-headline font-black text-lg text-white mb-6">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Service Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none"
                        placeholder="Premium Fade"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                      >
                        <option value="General">General</option>
                        <option value="Haircuts">Haircuts</option>
                        <option value="Beard">Beard</option>
                        <option value="Shaves">Shaves</option>
                        <option value="Premium">Premium</option>
                        <option value="Combos">Combos</option>
                        <option value="Design">Design</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none"
                        placeholder="45.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Duration (min) *</label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white focus:border-[#E5C487] focus:outline-none"
                        required
                      >
                        <option value="15">15 min</option>
                        <option value="20">20 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                        <option value="90">90 min</option>
                        <option value="120">120 min</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs text-[#4D463A] uppercase tracking-widest mb-2 block">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-[#353534]/50 border border-[#4D463A]/20 rounded-xl px-4 py-3 text-white placeholder-[#4D463A] focus:border-[#E5C487] focus:outline-none resize-none h-24"
                        placeholder="Describe your service..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingService(null);
                      }}
                      className="px-6 py-3 text-[#4D463A] hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-[#E5C487] text-[#402d00] font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                    </button>
                  </div>
                </form>
              )}

              {/* Services Grid */}
              {filteredServices.length === 0 ? (
                <div className="text-center py-20">
                  <span className="material-symbols-outlined text-6xl text-[#4D463A] mb-4">content_cut</span>
                  <p className="text-[#4D463A]">No services found</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 px-6 py-2 bg-[#E5C487] text-black rounded-lg font-bold"
                  >
                    Add Your First Service
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <div 
                      key={service.id} 
                      className={`bg-[#1C1B1B] rounded-3xl p-6 border transition-all hover:border-[#E5C487]/30 ${
                        service.is_active ? 'border-[#4D463A]/10' : 'border-red-500/20 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-[#E5C487]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#E5C487] text-2xl">
                            {categoryIcons[service.category] || "content_cut"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!service.is_active && (
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] uppercase rounded">Inactive</span>
                          )}
                          <div className="relative group">
                            <button className="text-[#4D463A] hover:text-[#E5C487] transition-colors">
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                            <div className="absolute right-0 top-full mt-2 bg-[#2A2A2A] rounded-xl shadow-xl border border-[#4D463A]/20 py-2 hidden group-hover:block z-10 min-w-[120px]">
                              <button 
                                onClick={() => startEdit(service)}
                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#353534] transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteService(service.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#353534] transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-lg font-bold text-white">{service.name}</h3>
                        {service.description && (
                          <p className="text-xs text-[#4D463A] mt-1 line-clamp-2">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-2xl font-headline font-black text-[#E5C487]">
                            ${parseFloat(String(service.price)).toFixed(2)}
                          </span>
                          <span className="text-xs text-[#4D463A] uppercase">{service.duration} min</span>
                        </div>
                        <span className="inline-block mt-2 px-2 py-1 bg-[#353534] text-[#E5C487] text-[10px] uppercase rounded">
                          {service.category}
                        </span>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => startEdit(service)}
                          className="flex-1 py-2 bg-[#353534]/50 text-[#4D463A] rounded-xl text-xs uppercase tracking-widest hover:text-white transition-all"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => toggleServiceStatus(service)}
                          className={`flex-1 py-2 rounded-xl text-xs uppercase tracking-widest transition-all ${
                            service.is_active 
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                              : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          }`}
                        >
                          {service.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <BarberAuthProvider>
      <ServicesContent />
    </BarberAuthProvider>
  );
}
