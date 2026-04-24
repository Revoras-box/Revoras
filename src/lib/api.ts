import axios from "axios";

import type {
  Admin,
  AdminLoginResponse,
  AdminDashboardStats,
  AdminStudiosResponse,
  AdminStudioResponse,
  AdminUsersResponse,
  StudioActionResponse,
  GeocodeResponse,
  ApiError,
} from "./types";

const API = "/api";

// Re-export types for convenience
export type * from "./types";

// Types
interface AuthCredentials {
  email: string;
  password: string;
}

interface StudioAuthLoginResponse {
  token?: string;
  owner?: unknown;
  barber?: unknown;
  studio?: unknown;
  error?: string;
}

interface SignupData extends AuthCredentials {
  name: string;
  phone?: string;
}

interface BarberSignupData extends SignupData {
  specialties?: string[];
  salonName?: string;
  panCard?: string;
  experience?: string;
  speciality?: string;
  shopAddress?: string;
  city?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  registrationPaymentToken?: string;
}

interface BookingData {
  studioId: string | number;
  barberId?: string;
  date: string;
  startTime: string;
  services: Array<{ serviceId: number; price: number; duration: number }>;
  notes?: string;
  paymentMethod?: string;
}

interface ReviewData {
  bookingId: string;
  studioId: number;
  barberId?: string;
  rating: number;
  title?: string;
  comment?: string;
}

interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
}

interface NotificationSettings {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  marketing?: boolean;
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

type AxiosFetchResponse<T = unknown> = {
  status: number;
  json: () => Promise<T>;
};

const fetch = async <T = unknown>(url: string, options: FetchOptions = {}): Promise<AxiosFetchResponse<T>> => {
  const response = await axios.request<T>({
    url,
    method: options.method ?? "GET",
    data: options.body,
    headers: options.headers,
    validateStatus: () => true,
  });

  return {
    status: response.status,
    json: async () => response.data,
  };
};

// Service data interface
interface ServiceData {
  name: string;
  description?: string;
  category?: string;
  price: number;
  duration: number;
  imageUrl?: string;
  isActive?: boolean;
}

// Walk-in booking interface
interface WalkInData {
  customerPhone?: string;
  customerName?: string;
  serviceIds: number[];
  notes?: string;
  assignedBarberId?: string;
}

// Studio settings interface
interface WorkingHourInput {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
}

interface StudioBarberSettingsData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  imageUrl?: string;
  logoUrl?: string;
  specialties?: string[];
  isActive?: boolean;
  workingHours?: WorkingHourInput[];
}

interface StudioSettingsData {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  amenities?: string[];
  workingHours?: WorkingHourInput[];
  barber?: StudioBarberSettingsData;
  barbers?: StudioBarberSettingsData[];
}

interface AddBarberToStudioData extends StudioBarberSettingsData {
  name: string;
  phone: string;
  password: string;
}

type NormalizedWorkingHours = {
  camel: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  snake: Array<{
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
  }>;
};

const normalizeWorkingHours = (workingHours?: WorkingHourInput[]): NormalizedWorkingHours | undefined => {
  if (!workingHours) return undefined;

  const camel = workingHours.map((hour) => ({
    dayOfWeek: hour.dayOfWeek,
    openTime: hour.openTime,
    closeTime: hour.closeTime,
    isClosed: hour.isClosed ?? false,
  }));

  return {
    camel,
    snake: camel.map((hour) => ({
      day_of_week: hour.dayOfWeek,
      open_time: hour.openTime,
      close_time: hour.closeTime,
      is_closed: hour.isClosed,
    })),
  };
};

const normalizeStudioBarberPayload = (barber: StudioBarberSettingsData): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};

  if (barber.id !== undefined) payload.id = barber.id;
  if (barber.name !== undefined) payload.name = barber.name;
  if (barber.email !== undefined) payload.email = barber.email;
  if (barber.phone !== undefined) payload.phone = barber.phone;
  if (barber.title !== undefined) payload.title = barber.title;
  if (barber.specialties !== undefined) payload.specialties = barber.specialties;
  if (barber.isActive !== undefined) payload.is_active = barber.isActive;

  const resolvedImage = barber.imageUrl ?? barber.logoUrl;
  if (resolvedImage !== undefined) {
    payload.image_url = resolvedImage;
  }

  const normalizedHours = normalizeWorkingHours(barber.workingHours);
  if (normalizedHours) {
    payload.workingHours = normalizedHours.camel;
    payload.working_hours = normalizedHours.snake;
  }

  return payload;
};

const normalizeStudioSettingsPayload = (data: StudioSettingsData): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};

  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.address !== undefined) payload.address = data.address;
  if (data.city !== undefined) payload.city = data.city;
  if (data.state !== undefined) payload.state = data.state;
  if (data.zipCode !== undefined) payload.zip_code = data.zipCode;
  if (data.country !== undefined) payload.country = data.country;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.email !== undefined) payload.email = data.email;
  if (data.lat !== undefined) payload.lat = data.lat;
  if (data.lng !== undefined) payload.lng = data.lng;
  if (data.amenities !== undefined) payload.amenities = data.amenities;

  if (data.imageUrl !== undefined) payload.image_url = data.imageUrl;
  if (data.logoUrl !== undefined) payload.logo_url = data.logoUrl;
  if (data.bannerUrl !== undefined) payload.banner_url = data.bannerUrl;

  const resolvedStudioImage = data.imageUrl ?? data.logoUrl;
  if (resolvedStudioImage !== undefined) payload.image_url = resolvedStudioImage;

  const normalizedHours = normalizeWorkingHours(data.workingHours);
  if (normalizedHours) {
    payload.workingHours = normalizedHours.camel;
    payload.working_hours = normalizedHours.snake;
  }

  if (data.barber) {
    const barberPayload = normalizeStudioBarberPayload(data.barber);
    payload.barber = barberPayload;
    payload.barber_profile = barberPayload;
  }

  if (data.barbers) {
    payload.barbers = data.barbers.map((barber) => normalizeStudioBarberPayload(barber));
  }

  return payload;
};

// Helper to get auth token (user)
const getToken = (): string => {
  if (typeof window === 'undefined') return "";
  return localStorage.getItem("token") || "";
};

// Helper to get barber/studio auth token (checks both studio owner and barber tokens)
const getBarberToken = (): string => {
  if (typeof window === 'undefined') return "";
  // Check studio owner token first, then barber token
  return localStorage.getItem("studioToken") || localStorage.getItem("barberToken") || "";
};

// Helper for authenticated requests (user)
const authFetch = async <T = unknown>(url: string, options: FetchOptions = {}): Promise<T> => {
  const token = getToken();
  const res = await fetch<T>(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (res.status === 401) {
    // Token expired - clear and redirect
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }
  
  return res.json();
};

// Helper for authenticated requests (barber)
const barberAuthFetch = async <T = unknown>(url: string, options: FetchOptions = {}): Promise<T> => {
  const token = getBarberToken();
  const res = await fetch<T>(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (res.status === 401) {
    // Token expired - clear and redirect to barber login
    if (typeof window !== 'undefined') {
      localStorage.removeItem("barberToken");
      localStorage.removeItem("barber");
      window.location.href = "/login-barber";
    }
  }
  
  return res.json();
};

// Helper to get admin auth token
const getAdminToken = (): string => {
  if (typeof window === 'undefined') return "";
  return localStorage.getItem("adminToken") || "";
};

// Helper for authenticated requests (admin)
const adminAuthFetch = async <T = unknown>(url: string, options: FetchOptions = {}): Promise<T> => {
  const token = getAdminToken();
  const res = await fetch<T>(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (res.status === 401) {
    // Token expired - clear and redirect to admin login
    if (typeof window !== 'undefined') {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    }
  }
  
  return res.json();
};

export const api = {
  // ==========================================
  // Auth APIs
  // ==========================================
  userSignup: async (data: SignupData) => {
    const res = await fetch(`${API}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  userLogin: async (data: AuthCredentials) => {
    const res = await fetch<{
      error: string | undefined; token?: string; user?: unknown 
}>(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    }
    return result;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  // ==========================================
  // Studio Auth APIs (New - Recommended)
  // ==========================================
  
  studioSignup: async (data: {
    ownerName: string;
    email: string;
    phone: string;
    password: string;
    studioName: string;
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  }) => {
    const res = await fetch(`${API}/studios/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  studioLogin: async (data: { phone?: string; email?: string; password: string }) => {
    const res = await fetch<StudioAuthLoginResponse>(`${API}/studios/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) {
      localStorage.setItem("studioToken", result.token);
      localStorage.setItem("studioOwner", JSON.stringify(result.owner));
      localStorage.setItem("studio", JSON.stringify(result.studio));
    }
    return result;
  },

  studioLogout: () => {
    localStorage.removeItem("studioToken");
    localStorage.removeItem("studioOwner");
    localStorage.removeItem("studio");
    // Also clear legacy barber tokens
    localStorage.removeItem("barberToken");
    localStorage.removeItem("barber");
    window.location.href = "/";
  },

  addBarberToStudio: async (data: AddBarberToStudioData) => {
    const payload = {
      ...normalizeStudioBarberPayload(data),
      password: data.password,
    };

    return barberAuthFetch(`${API}/studios/auth/barbers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },

  // Barber login (for barbers added by studio)
  barberEmployeeLogin: async (data: { phone: string; password: string }) => {
    const res = await fetch<StudioAuthLoginResponse>(`${API}/studios/auth/barber-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) {
      localStorage.setItem("barberToken", result.token);
      localStorage.setItem("barber", JSON.stringify(result.barber));
      localStorage.setItem("studio", JSON.stringify(result.studio));
    }
    return result;
  },

  // ==========================================
  // Legacy Studio Manage Auth (Backward Compatibility)
  // ==========================================

  barberSignup: async (data: BarberSignupData) => {
    const res = await fetch(`${API}/studios/manage/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  createBarberSignupPaymentOrder: async (data: { name: string; email: string; phone: string }) => {
    const res = await fetch(`${API}/studios/manage/signup/payment/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  verifyBarberSignupPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    const res = await fetch(`${API}/studios/manage/signup/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  barberLogin: async (data: { phone: string; password: string }) => {
    const res = await fetch(`${API}/studios/manage/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  sendVerification: async (data: { email?: string; phone?: string }) => {
    const res = await fetch(`${API}/verification/send-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  verifyCode: async (data: { email?: string; phone?: string; code: string }) => {
    const res = await fetch(`${API}/verification/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  forgotPassword: async (email: string) => {
    const res = await fetch(`${API}/password/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  resetPassword: async (token: string, newPassword: string) => {
    const res = await fetch(`${API}/password/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword })
    });
    return res.json();
  },

  // ==========================================
  // Studio APIs
  // ==========================================
  getStudios: async (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/studios${query ? `?${query}` : ""}`);
  },

  getStudiosForMap: async (params: { lat?: number; lng?: number; radius?: number; minLat?: number; maxLat?: number; minLng?: number; maxLng?: number; limit?: number } = {}) => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = String(value);
    });
    const query = new URLSearchParams(filteredParams).toString();
    return authFetch<{
      studios: Array<{
        id: number;
        name: string;
        lat: number;
        lng: number;
        address: string;
        city: string;
        state: string;
        rating: number;
        review_count: number;
        image_url: string;
        amenities: string[];
        is_open: boolean;
        next_open: string | null;
        distance_km?: number;
      }>;
      center: { lat: number; lng: number } | null;
      count: number;
    }>(`${API}/studios/map${query ? `?${query}` : ""}`);
  },

  getStudio: async (id: string) => {
    return authFetch(`${API}/studios/${id}`);
  },

  getStudioServices: async (id: string, category?: string) => {
    const query = category ? `?category=${category}` : "";
    return authFetch(`${API}/studios/${id}/services${query}`);
  },

  getStudioBarbers: async (id: string) => {
    return authFetch(`${API}/studios/${id}/barbers`);
  },

  // ==========================================
  // Booking APIs
  // ==========================================
  getAvailability: async (studioId: string, barberId: string, date: string) => {
    const params = new URLSearchParams();
    params.append("studioId", studioId);
    params.append("date", date);
    params.append("barberId", barberId);
    return authFetch<{ slots: string[]; error?: string }>(`${API}/bookings/availability?${params}`);
  },

  createBooking: async (data: BookingData) => {
    return authFetch(`${API}/bookings`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  getBookings: async (params: Record<string, string | undefined> = {}) => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = value;
    });
    const query = new URLSearchParams(filteredParams).toString();
    return authFetch(`${API}/bookings${query ? `?${query}` : ""}`);
  },

  getBooking: async (id: string) => {
    return authFetch(`${API}/bookings/${id}`);
  },

  cancelBooking: async (id: string, reason?: string) => {
    return authFetch(`${API}/bookings/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason })
    });
  },

  rescheduleBooking: async (id: string, data: { date: string; startTime: string }) => {
    return authFetch(`${API}/bookings/${id}/reschedule`, {
      method: "PATCH",
      body: JSON.stringify({ appointmentDate: data.date, appointmentTime: data.startTime })
    });
  },

  // ==========================================
  // Review APIs
  // ==========================================
  createReview: async (data: ReviewData) => {
    return authFetch(`${API}/reviews`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  getStudioReviews: async (studioId: string, params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/reviews/studio/${studioId}${query ? `?${query}` : ""}`);
  },

  getBarberReviews: async (barberId: string, params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/reviews/barber/${barberId}${query ? `?${query}` : ""}`);
  },

  getMyReviews: async (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/reviews/me${query ? `?${query}` : ""}`);
  },

  markReviewHelpful: async (id: string) => {
    return authFetch(`${API}/reviews/${id}/helpful`, {
      method: "POST"
    });
  },

  // ==========================================
  // Profile APIs
  // ==========================================
  getProfile: async () => {
    return authFetch(`${API}/profile`);
  },

  updateProfile: async (data: ProfileData) => {
    return authFetch(`${API}/profile`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  updateNotifications: async (settings: NotificationSettings) => {
    return authFetch(`${API}/profile/notifications`, {
      method: "PUT",
      body: JSON.stringify(settings)
    });
  },

  deleteAccount: async (password: string) => {
    return authFetch(`${API}/profile`, {
      method: "DELETE",
      body: JSON.stringify({ password })
    });
  },

  getFavorites: async () => {
    return authFetch(`${API}/profile/favorites`);
  },

  addFavorite: async (studioId: string | number) => {
    return authFetch(`${API}/profile/favorites/${studioId}`, {
      method: "POST"
    });
  },

  removeFavorite: async (studioId: string | number) => {
    return authFetch(`${API}/profile/favorites/${studioId}`, {
      method: "DELETE"
    });
  },

  // ==========================================
  // Admin APIs
  // ==========================================

  getBarberStatus: async () => {
    const res = await fetch(`${API}/studios/manage/me/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("barberToken") : ""}`
      }
    });
    return res.json();
  },

  // ==========================================
  // Studio Manage APIs
  // ==========================================
  
  // Dashboard stats
  getBarberDashboard: async () => {
    return barberAuthFetch(`${API}/studios/manage/dashboard`);
  },

  // Barber's bookings/schedule
  getBarberBookings: async (params: { date?: string; status?: string; page?: number; limit?: number } = {}) => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = String(value);
    });
    const query = new URLSearchParams(filteredParams).toString();
    return barberAuthFetch(`${API}/studios/manage/bookings${query ? `?${query}` : ""}`);
  },

  // Update booking status
  updateBarberBookingStatus: async (bookingId: string, status: string) => {
    return barberAuthFetch(`${API}/studios/manage/bookings/${bookingId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
  },

  // Services management
  getBarberStudioServices: async () => {
    return barberAuthFetch(`${API}/studios/manage/services`);
  },

  createBarberService: async (data: ServiceData) => {
    return barberAuthFetch(`${API}/studios/manage/services`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  updateBarberService: async (serviceId: number, data: Partial<ServiceData>) => {
    return barberAuthFetch(`${API}/studios/manage/services/${serviceId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  deleteBarberService: async (serviceId: number) => {
    return barberAuthFetch(`${API}/studios/manage/services/${serviceId}`, {
      method: "DELETE"
    });
  },

  // Team management
  getBarberTeam: async () => {
    return barberAuthFetch(`${API}/studios/manage/team`);
  },

  updateStudioBarber: async (barberId: string, data: Partial<StudioBarberSettingsData>) => {
    return barberAuthFetch(`${API}/studios/auth/barbers/${barberId}`, {
      method: "PUT",
      body: JSON.stringify(normalizeStudioBarberPayload(data))
    });
  },

  deleteStudioBarber: async (barberId: string) => {
    return barberAuthFetch(`${API}/studios/auth/barbers/${barberId}`, {
      method: "DELETE"
    });
  },

  // Analytics
  getBarberAnalytics: async (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    return barberAuthFetch(`${API}/studios/manage/analytics?period=${period}`);
  },

  // Studio settings
  getBarberStudioSettings: async () => {
    return barberAuthFetch(`${API}/studio/settings`);
  },

  updateBarberStudioSettings: async (data: StudioSettingsData) => {
    const payload = normalizeStudioSettingsPayload(data);
    return barberAuthFetch(`${API}/studio/settings`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },

  // Walk-in booking
  createWalkInBooking: async (data: WalkInData) => {
    return barberAuthFetch(`${API}/studios/manage/walk-in`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  // Barber reviews
  getBarberDashboardReviews: async (params: { page?: number; limit?: number } = {}) => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = String(value);
    });
    const query = new URLSearchParams(filteredParams).toString();
    return barberAuthFetch(`${API}/studios/manage/reviews${query ? `?${query}` : ""}`);
  },

  // Barber payments
  getBarberPayments: async (params: { status?: string; page?: number; limit?: number } = {}) => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = String(value);
    });
    const query = new URLSearchParams(filteredParams).toString();
    return barberAuthFetch(`${API}/studios/manage/payments${query ? `?${query}` : ""}`);
  },

  updatePaymentStatus: async (bookingId: number, data: { paymentStatus?: string; paymentMethod?: string }) => {
    return barberAuthFetch(`${API}/studios/manage/payments/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },

  // ==========================================
  // Admin APIs
  // ==========================================
  
  adminLogin: async (data: { email: string; password: string }) => {
    const res = await fetch<AdminLoginResponse>(`${API}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) {
      localStorage.setItem("adminToken", result.token);
      localStorage.setItem("admin", JSON.stringify(result.admin));
    }
    return result as AdminLoginResponse;
  },

  adminLogout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  },

  getAdminProfile: async (): Promise<{ admin: Admin } & ApiError> => {
    return adminAuthFetch(`${API}/admin/me`);
  },

  getAdminDashboard: async (): Promise<AdminDashboardStats> => {
    return adminAuthFetch(`${API}/admin/dashboard`);
  },

  getAdminStudios: async (params: { status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}): Promise<AdminStudiosResponse> => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = String(value);
    });
    const query = new URLSearchParams(filteredParams).toString();
    return adminAuthFetch(`${API}/admin/studios${query ? `?${query}` : ""}`);
  },

  getAdminStudio: async (id: string | number): Promise<AdminStudioResponse> => {
    return adminAuthFetch(`${API}/admin/studios/${id}`);
  },

  updateAdminStudio: async (id: string | number, data: Record<string, unknown>): Promise<StudioActionResponse> => {
    return adminAuthFetch(`${API}/admin/studios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  approveStudio: async (id: string | number, adminNotes?: string): Promise<StudioActionResponse> => {
    return adminAuthFetch(`${API}/admin/studios/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ admin_notes: adminNotes })
    });
  },

  rejectStudio: async (id: string | number, reason: string, adminNotes?: string): Promise<StudioActionResponse> => {
    return adminAuthFetch(`${API}/admin/studios/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason, admin_notes: adminNotes })
    });
  },

  suspendStudio: async (id: string | number, reason: string): Promise<StudioActionResponse> => {
    return adminAuthFetch(`${API}/admin/studios/${id}/suspend`, {
      method: "POST",
      body: JSON.stringify({ reason })
    });
  },

  geocodeStudio: async (id: string | number, addressOverride?: { address?: string; city?: string; state?: string; country?: string }): Promise<GeocodeResponse> => {
    return adminAuthFetch(`${API}/admin/studios/${id}/geocode`, {
      method: "POST",
      body: JSON.stringify(addressOverride || {})
    });
  },

  getAdminUsers: async (params: { search?: string; page?: number; limit?: number } = {}): Promise<AdminUsersResponse> => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = String(value);
    });
    const query = new URLSearchParams(filteredParams).toString();
    return adminAuthFetch(`${API}/admin/users${query ? `?${query}` : ""}`);
  },

  getAdmins: async (): Promise<{ admins: Admin[] } & ApiError> => {
    return adminAuthFetch(`${API}/admin/admins`);
  },

  createAdmin: async (data: { name: string; email: string; password: string; role?: string }): Promise<{ message?: string; admin?: Admin } & ApiError> => {
    return adminAuthFetch(`${API}/admin/admins`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
};
