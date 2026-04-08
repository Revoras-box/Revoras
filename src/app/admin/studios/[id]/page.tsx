"use client";

import { useEffect, useState, use, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  api, 
  type AdminStudioDetail, 
  type StudioApprovalStatus 
} from "@/lib/api";

type TabType = "details" | "team" | "services";

interface StudioFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  lat: string;
  lng: string;
  phone: string;
  email: string;
  admin_notes: string;
}

const dayNames: readonly string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface PageParams {
  id: string;
}

export default function AdminStudioDetailPage({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [studio, setStudio] = useState<AdminStudioDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [geocoding, setGeocoding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  
  // Edit form state
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<StudioFormData>({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    lat: "",
    lng: "",
    phone: "",
    email: "",
    admin_notes: "",
  });

  useEffect(() => {
    loadStudio();
  }, [id]);

  const loadStudio = async (): Promise<void> => {
    try {
      const result = await api.getAdminStudio(id);
      if (result.studio) {
        setStudio(result.studio);
        setFormData({
          name: result.studio.name || "",
          description: result.studio.description || "",
          address: result.studio.address || "",
          city: result.studio.city || "",
          state: result.studio.state || "",
          zip_code: result.studio.zip_code || "",
          country: result.studio.country || "USA",
          lat: result.studio.lat?.toString() || "",
          lng: result.studio.lng?.toString() || "",
          phone: result.studio.phone || "",
          email: result.studio.email || "",
          admin_notes: result.studio.admin_notes || "",
        });
      }
    } catch (error) {
      console.error("Failed to load studio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    try {
      const updateData = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
      };
      
      const result = await api.updateAdminStudio(id, updateData);
      if (!result.error) {
        setEditMode(false);
        loadStudio();
      } else {
        alert(result.error);
      }
    } catch {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleGeocode = async (): Promise<void> => {
    setGeocoding(true);
    try {
      const result = await api.geocodeStudio(id, {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      });
      
      if (result.location) {
        setFormData({
          ...formData,
          lat: result.location.lat.toString(),
          lng: result.location.lng.toString(),
        });
        loadStudio();
      } else {
        alert(result.error || "Could not geocode address");
      }
    } catch {
      alert("Geocoding failed");
    } finally {
      setGeocoding(false);
    }
  };

  const handleApprove = async (): Promise<void> => {
    if (!confirm("Are you sure you want to approve this studio?")) return;
    
    try {
      const result = await api.approveStudio(id, formData.admin_notes);
      if (!result.error) {
        loadStudio();
      } else {
        alert(result.error);
      }
    } catch {
      alert("Failed to approve studio");
    }
  };

  const handleReject = async (): Promise<void> => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;
    
    try {
      const result = await api.rejectStudio(id, reason, formData.admin_notes);
      if (!result.error) {
        loadStudio();
      } else {
        alert(result.error);
      }
    } catch {
      alert("Failed to reject studio");
    }
  };

  const handleSuspend = async (): Promise<void> => {
    const reason = prompt("Please provide a reason for suspension:");
    if (!reason) return;
    
    try {
      const result = await api.suspendStudio(id, reason);
      if (!result.error) {
        loadStudio();
      } else {
        alert(result.error);
      }
    } catch {
      alert("Failed to suspend studio");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E5C487]"></div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">error</span>
        <p className="text-gray-500">Studio not found</p>
        <Link href="/admin/studios" className="text-[#E5C487] hover:underline mt-4 inline-block">
          Back to Studios
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    suspended: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/studios"
            className="p-2 hover:bg-[#222] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-gray-400">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white font-headline">{studio.name}</h1>
            <p className="text-gray-500 mt-1">{studio.city}, {studio.state}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[studio.approval_status]}`}>
            {studio.approval_status}
          </span>
          
          {studio.approval_status === "pending" && (
            <>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                Approve
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Reject
              </button>
            </>
          )}
          
          {studio.approval_status === "approved" && (
            <button
              onClick={handleSuspend}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Suspend
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-[#222]">
        {(["details", "team", "services"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#E5C487] text-[#E5C487]"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Studio Information</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-[#E5C487] hover:underline text-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-3 py-1 text-gray-400 hover:text-white text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-1 bg-[#E5C487] text-[#1a1a1a] rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-white">{studio.name}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Address</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-white">{studio.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">City</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-white">{studio.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">State</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-white">{studio.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">ZIP Code</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-white">{studio.zip_code || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Country</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-white">{studio.country || "USA"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-white">{studio.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-white">{studio.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Location Coordinates</h2>
                <button
                  onClick={handleGeocode}
                  disabled={geocoding}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {geocoding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Geocoding...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">location_searching</span>
                      Auto-detect from Address
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                      placeholder="e.g., 37.7749"
                    />
                  ) : (
                    <p className={studio.lat ? "text-white" : "text-amber-400"}>
                      {studio.lat || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white"
                      placeholder="e.g., -122.4194"
                    />
                  ) : (
                    <p className={studio.lng ? "text-white" : "text-amber-400"}>
                      {studio.lng || "Not set"}
                    </p>
                  )}
                </div>
              </div>

              {!studio.lat && !studio.lng && (
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-400 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    Coordinates are required for the studio to appear on the map. Click "Auto-detect from Address" to geocode.
                  </p>
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Admin Notes</h2>
              {editMode ? (
                <textarea
                  value={formData.admin_notes}
                  onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white resize-none"
                  placeholder="Add internal notes about this studio..."
                />
              ) : (
                <p className="text-gray-400">{studio.admin_notes || "No notes"}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Owner</h2>
              {studio.owner_name ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-white">{studio.owner_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-white">{studio.owner_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-white">{studio.owner_phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Registered</p>
                    <p className="text-white">{studio.owner_since ? new Date(studio.owner_since).toLocaleDateString() : "Unknown"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No owner information</p>
              )}
            </div>

            {/* Working Hours */}
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Working Hours</h2>
              <div className="space-y-2">
                {studio.workingHours.map((hours) => (
                  <div key={hours.day_of_week} className="flex justify-between text-sm">
                    <span className="text-gray-400">{dayNames[hours.day_of_week]}</span>
                    <span className={hours.is_closed ? "text-red-400" : "text-white"}>
                      {hours.is_closed ? "Closed" : `${hours.open_time?.slice(0, 5)} - ${hours.close_time?.slice(0, 5)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Info */}
            {(studio.approved_at || studio.rejection_reason) && (
              <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Approval History</h2>
                {studio.approved_at && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">Approved</p>
                    <p className="text-white">{new Date(studio.approved_at).toLocaleString()}</p>
                    {studio.approved_by_name && (
                      <p className="text-sm text-gray-400">by {studio.approved_by_name}</p>
                    )}
                  </div>
                )}
                {studio.rejection_reason && (
                  <div>
                    <p className="text-xs text-gray-500">Rejection Reason</p>
                    <p className="text-red-400">{studio.rejection_reason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Team Members ({studio.barbers.length})</h2>
          {studio.barbers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No team members</p>
          ) : (
            <div className="grid gap-4">
              {studio.barbers.map((barber) => (
                <div key={barber.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E5C487]/20 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#E5C487]">person</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{barber.name}</p>
                      <p className="text-sm text-gray-500">{barber.title || "Barber"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{barber.phone}</p>
                    <span className={`text-xs ${barber.is_active ? "text-green-400" : "text-red-400"}`}>
                      {barber.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Services ({studio.services.length})</h2>
          {studio.services.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No services</p>
          ) : (
            <div className="grid gap-4">
              {studio.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="font-medium text-white">{service.name}</p>
                    <p className="text-sm text-gray-500">{service.category} • {service.duration} min</p>
                  </div>
                  <p className="text-lg font-bold text-[#E5C487]">${service.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
