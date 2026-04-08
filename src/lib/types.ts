// ==========================================
// Admin Types
// ==========================================

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
}

export interface AdminLoginResponse {
  token?: string;
  admin?: Admin;
  error?: string;
}

export interface AdminDashboardStats {
  studios: {
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
    total: number;
  };
  users: {
    total: number;
  };
  bookings: {
    total: number;
    completed: number;
    upcoming: number;
    revenue: number;
  };
  recentPendingStudios: AdminStudioSummary[];
  recentActivity: AdminActivityLog[];
  error?: string;
}

export interface AdminActivityLog {
  id: number;
  admin_id: string;
  admin_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

// ==========================================
// Studio Types
// ==========================================

export type StudioApprovalStatus = "pending" | "approved" | "rejected" | "suspended";

export interface AdminStudioSummary {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  approval_status: StudioApprovalStatus;
  rating: number | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  owner_name: string | null;
  owner_email: string | null;
  booking_count: number;
  barber_count: number;
}

export interface AdminStudioDetail {
  id: number;
  name: string;
  description: string | null;
  address: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
  gallery: string[];
  rating: number | null;
  review_count: number;
  amenities: string[];
  approval_status: StudioApprovalStatus;
  admin_notes: string | null;
  rejection_reason: string | null;
  approved_at: string | null;
  approved_by: string | null;
  approved_by_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Owner info
  owner_id: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_phone: string | null;
  owner_since: string | null;
  // Related data
  barbers: StudioBarber[];
  services: StudioService[];
  workingHours: StudioWorkingHours[];
}

export interface StudioBarber {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  title: string | null;
  is_active: boolean;
  rating: number | null;
}

export interface StudioService {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string;
  is_active: boolean;
}

export interface StudioWorkingHours {
  id: number;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

export interface AdminStudiosResponse {
  studios: AdminStudioSummary[];
  pagination: Pagination;
  error?: string;
}

export interface AdminStudioResponse {
  studio: AdminStudioDetail;
  error?: string;
}

export interface StudioActionResponse {
  message?: string;
  studio?: AdminStudioDetail;
  error?: string;
}

export interface GeocodeResponse {
  message?: string;
  location?: {
    lat: number;
    lng: number;
    displayName: string;
  };
  error?: string;
}

// ==========================================
// User Types
// ==========================================

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  booking_count: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: Pagination;
  error?: string;
}

// ==========================================
// Common Types
// ==========================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiError {
  error: string;
}

// ==========================================
// Map Types
// ==========================================

export interface MapStudio {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  rating: number | null;
  review_count: number;
  image_url: string | null;
  amenities: string[];
  is_open: boolean;
  next_open: string | null;
  distance_km?: number;
}

export interface MapStudiosResponse {
  studios: MapStudio[];
  center: { lat: number; lng: number } | null;
  count: number;
  error?: string;
}
