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
  BusinessesResponse,
  BusinessesMapResponse,
  BusinessResponse,
  ServicesResponse,
  ProfessionalsResponse,
  ProfessionalResponse,
  CategoriesResponse,
  ReviewsResponse,
  NotificationsResponse,
  BookingsResponse,
  BookingResponse,
  BookingDetail,
  ProfileResponse,
  FavoritesResponse,
  Profile,
  Notification,
  AdminVerificationQueueResponse,
  AdminVerificationDetail,
  CollectionsResponse,
  CollectionResponse,
  FavoriteIdsResponse,
  FavoriteProfessionalsResponse,
  RecentlyViewedResponse,
  BookingQuoteResponse,
  BookingTimelineResponse,
  CancellationQuoteResponse,
  AvailabilityResponse,
  AvailabilityDay,
} from "./types";

// const API = "https://api.revoras.tech/api";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.revoras.tech/api";


// Re-export types for convenience
export type * from "./types";

// Types
interface AuthCredentials {
  email: string;
  password: string;
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
}

interface BookingData {
  studioId: string;
  businessMemberId: string;
  serviceIds: string[];
  date: string;
  startTime: string;
  notes?: string;
}

// Matches createReviewSchema. The studio and professional are derived from the
// booking server-side (never accepted as input, so a review can't be pinned to
// a business the reviewer never booked) — the old `studioId: number` /
// `barberId` fields here predated that and were both wrong: studio ids are
// UUID strings, and neither is part of the request.
interface ReviewData {
  bookingId: string;
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

// Helper to get auth token (user)
const getToken = (): string => {
  if (typeof window === 'undefined') return "";
  return localStorage.getItem("token") || "";
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
  
  // Phase 2.3 (report.md Phase 2 plan): business registration is now one
  // unified endpoint (Business + owning User + owner Business Member +
  // default working hours, created atomically) instead of the old
  // studio.auth.controller.js signupStudio. Field names below are mapped to
  // the new /api/auth/business/register contract; emailVerified/
  // phoneVerified are still accepted but ignored server-side (the backend
  // independently re-checks the OTP proof - always has, see
  // consumeVerificationProof).
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
    const res = await fetch(`${API}/auth/business/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        businessName: data.studioName,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      })
    });
    return res.json();
  },

  // Matches the backend contract (verification.controller.js): `type` selects
  // email vs phone, and verify expects `otp`. Returns `{ otp }` in dev mode.
  sendVerification: async (data: { email?: string; phone?: string; type: "email" | "phone" }) => {
    const res = await fetch<{ otp?: string; error?: string }>(`${API}/verification/send-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  verifyCode: async (data: { email?: string; phone?: string; type: "email" | "phone"; otp: string }) => {
    const res = await fetch<{ verified?: boolean; error?: string }>(`${API}/verification/verify-code`, {
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
  // Discover APIs (businesses/professionals - public, optionalAuth)
  // ==========================================
  getBusinesses: async (params: Record<string, string> = {}): Promise<BusinessesResponse> => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/discover/businesses${query ? `?${query}` : ""}`);
  },

  getBusinessesMap: async (params: { lat?: number; lng?: number; radiusKm?: number; minLat?: number; maxLat?: number; minLng?: number; maxLng?: number; limit?: number } = {}): Promise<BusinessesMapResponse> => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = String(value);
    });
    const query = new URLSearchParams(filteredParams).toString();
    return authFetch(`${API}/discover/businesses/map${query ? `?${query}` : ""}`);
  },

  getBusiness: async (id: string): Promise<BusinessResponse> => {
    return authFetch(`${API}/discover/businesses/${id}`);
  },

  getBusinessServices: async (id: string): Promise<ServicesResponse> => {
    return authFetch(`${API}/discover/businesses/${id}/services`);
  },

  getBusinessProfessionals: async (id: string): Promise<ProfessionalsResponse> => {
    return authFetch(`${API}/discover/businesses/${id}/professionals`);
  },

  getProfessional: async (id: string): Promise<ProfessionalResponse> => {
    return authFetch(`${API}/discover/professionals/${id}`);
  },

  getCategories: async (type?: "business" | "service"): Promise<CategoriesResponse> => {
    const query = type ? `?type=${type}` : "";
    return authFetch(`${API}/categories${query}`);
  },

  // Phase 2.2 (Discovery Curation System) - editorial collections.
  getCollections: async (params: { city?: string } = {}): Promise<CollectionsResponse> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return authFetch(`${API}/discover/collections${query ? `?${query}` : ""}`);
  },

  getCollection: async (slug: string, params: { page?: number; limit?: number } = {}): Promise<CollectionResponse> => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined) filteredParams[key] = String(value); });
    const query = new URLSearchParams(filteredParams).toString();
    return authFetch(`${API}/discover/collections/${slug}${query ? `?${query}` : ""}`);
  },

  // ==========================================
  // Booking APIs
  // ==========================================
  /**
   * Bookable start times for one professional on one date.
   *
   * Prefer `serviceIds` over `duration`: the server then sums the real service
   * durations itself, so the grid and the booking endpoint agree on how long
   * the appointment runs and a shown slot can't be rejected for length.
   *
   * The server applies the shop's hours AND the professional's own rota - no
   * client-side filtering is needed (or correct) on top of this.
   */
  getAvailability: async (
    _studioId: string,
    businessMemberId: string,
    date: string,
    duration?: number,
    serviceIds?: string[]
  ) => {
    const params = new URLSearchParams();
    params.append("businessMemberId", businessMemberId);
    params.append("date", date);
    if (serviceIds?.length) params.append("serviceIds", serviceIds.join(","));
    else if (duration) params.append("duration", String(duration));
    return authFetch<AvailabilityResponse>(`${API}/bookings/availability?${params}`);
  },

  /** Per-day capacity across a date range, for greying out full/closed days. */
  getAvailabilityCalendar: async (
    businessMemberId: string,
    from: string,
    days: number,
    serviceIds?: string[]
  ) => {
    const params = new URLSearchParams();
    params.append("businessMemberId", businessMemberId);
    params.append("from", from);
    params.append("days", String(days));
    if (serviceIds?.length) params.append("serviceIds", serviceIds.join(","));
    return authFetch<{ days: AvailabilityDay[]; error?: string }>(
      `${API}/bookings/availability/calendar?${params}`
    );
  },

  createBooking: async (data: BookingData): Promise<{ message?: string; booking?: BookingDetail; error?: string }> => {
    return authFetch(`${API}/bookings`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  // Phase 2.4 — price + applicable-offer preview for a set of services, before booking.
  quoteBooking: async (studioId: string, serviceIds: string[]): Promise<BookingQuoteResponse> => {
    return authFetch(`${API}/bookings/quote`, {
      method: "POST",
      body: JSON.stringify({ studioId, serviceIds }),
    });
  },

  getBookings: async (params: Record<string, string | undefined> = {}): Promise<BookingsResponse> => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = value;
    });
    const query = new URLSearchParams(filteredParams).toString();
    return authFetch(`${API}/bookings${query ? `?${query}` : ""}`);
  },

  getBooking: async (id: string): Promise<BookingResponse> => {
    return authFetch(`${API}/bookings/${id}`);
  },

  // Phase 2.5
  getBookingTimeline: async (id: string): Promise<BookingTimelineResponse> => {
    return authFetch(`${API}/bookings/${id}/timeline`);
  },

  getCancellationQuote: async (id: string): Promise<CancellationQuoteResponse> => {
    return authFetch(`${API}/bookings/${id}/cancellation-quote`);
  },

  cancelBooking: async (id: string, reason?: string): Promise<{ message?: string; error?: string }> => {
    return authFetch(`${API}/bookings/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason })
    });
  },

  rescheduleBooking: async (id: string, data: { date: string; startTime: string }): Promise<{ message?: string; error?: string }> => {
    return authFetch(`${API}/bookings/${id}/reschedule`, {
      method: "PATCH",
      body: JSON.stringify(data)
    });
  },

  // ==========================================
  // Payment APIs (Razorpay)
  // ==========================================
  /**
   * Which payment path the server offers. "mock" is the temporary
   * instant-confirm stand-in used while the gateway has no live keys — the
   * checkout labels its button from this rather than guessing.
   */
  getPaymentConfig: async () => {
    return authFetch<{ mode?: "mock" | "razorpay"; razorpayConfigured?: boolean; error?: string }>(
      `${API}/payments/config`
    );
  },

  /** Temporary: confirms a booking without a gateway. Rejected unless the server is in mock mode. */
  confirmMockPayment: async (bookingId: string | number) => {
    return authFetch<{ message?: string; paid?: boolean; alreadyPaid?: boolean; error?: string }>(
      `${API}/payments/mock-confirm`,
      { method: "POST", body: JSON.stringify({ bookingId }) }
    );
  },

  createPaymentOrder: async (bookingId: string | number) => {
    return authFetch<{
      orderId?: string;
      amount?: number;
      currency?: string;
      keyId?: string;
      bookingId?: string | number;
      error?: string;
    }>(`${API}/payments/create-order`, {
      method: "POST",
      body: JSON.stringify({ bookingId })
    });
  },

  verifyPayment: async (data: {
    bookingId: string | number;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    return authFetch<{ message?: string; verified?: boolean; error?: string }>(`${API}/payments/verify`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  // ==========================================
  // Review APIs
  // ==========================================
  createReview: async (data: ReviewData): Promise<{ message?: string; error?: string }> => {
    return authFetch(`${API}/reviews`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  getBusinessReviews: async (studioId: string, params: Record<string, string> = {}): Promise<ReviewsResponse> => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/reviews/business/${studioId}${query ? `?${query}` : ""}`);
  },

  getProfessionalReviews: async (memberId: string, params: Record<string, string> = {}): Promise<ReviewsResponse> => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`${API}/reviews/professional/${memberId}${query ? `?${query}` : ""}`);
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
  getProfile: async (): Promise<ProfileResponse> => {
    return authFetch(`${API}/profile`);
  },

  updateProfile: async (data: ProfileData): Promise<{ message?: string; user?: Profile; error?: string }> => {
    return authFetch(`${API}/profile`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  updateNotifications: async (settings: NotificationSettings): Promise<{ message?: string; settings?: unknown; error?: string }> => {
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

  getFavorites: async (): Promise<FavoritesResponse> => {
    return authFetch(`${API}/profile/favorites`);
  },

  addFavorite: async (studioId: string | number): Promise<{ message?: string; error?: string }> => {
    return authFetch(`${API}/profile/favorites/${studioId}`, {
      method: "POST"
    });
  },

  removeFavorite: async (studioId: string | number): Promise<{ message?: string; error?: string }> => {
    return authFetch(`${API}/profile/favorites/${studioId}`, {
      method: "DELETE"
    });
  },

  // Phase 2.3 — id-only projection backing the heart on every discovery card.
  // Deliberately not getFavorites(): that ships a full business card per
  // favorite, which is a lot of payload to decide which hearts are filled.
  getFavoriteIds: async (): Promise<FavoriteIdsResponse> => {
    return authFetch(`${API}/profile/favorites/ids`);
  },

  getFavoriteProfessionals: async (): Promise<FavoriteProfessionalsResponse> => {
    return authFetch(`${API}/profile/favorites/professionals`);
  },

  addFavoriteProfessional: async (memberId: string): Promise<{ message?: string; error?: string }> => {
    return authFetch(`${API}/profile/favorites/professionals/${memberId}`, {
      method: "POST"
    });
  },

  removeFavoriteProfessional: async (memberId: string): Promise<{ message?: string; error?: string }> => {
    return authFetch(`${API}/profile/favorites/professionals/${memberId}`, {
      method: "DELETE"
    });
  },

  // Phase 2.3 — server-side recently-viewed (authenticated users only; the
  // anonymous path stays in lib/recently-viewed.ts).
  getRecentlyViewed: async (params: { limit?: number } = {}): Promise<RecentlyViewedResponse> => {
    const q = params.limit ? `?limit=${params.limit}` : "";
    return authFetch(`${API}/profile/recently-viewed${q}`);
  },

  recordBusinessView: async (studioId: string): Promise<void> => {
    await authFetch(`${API}/profile/recently-viewed/${studioId}`, { method: "POST" });
  },

  clearRecentlyViewed: async (): Promise<{ message?: string; error?: string }> => {
    return authFetch(`${API}/profile/recently-viewed`, { method: "DELETE" });
  },

  // ==========================================
  // Notification APIs
  // ==========================================
  getNotifications: async (params: { unreadOnly?: boolean; page?: number; limit?: number } = {}): Promise<NotificationsResponse> => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = String(value);
    });
    const query = new URLSearchParams(filteredParams).toString();
    return authFetch(`${API}/notifications${query ? `?${query}` : ""}`);
  },

  getUnreadNotificationCount: async (): Promise<{ count: number; error?: string }> => {
    return authFetch(`${API}/notifications/unread-count`);
  },

  markNotificationRead: async (id: string): Promise<{ notification?: Notification; error?: string }> => {
    return authFetch(`${API}/notifications/${id}/read`, { method: "PATCH" });
  },

  markAllNotificationsRead: async (): Promise<{ message?: string; error?: string }> => {
    return authFetch(`${API}/notifications/read-all`, { method: "PATCH" });
  },

  // ==========================================
  // Admin APIs
  // ==========================================

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

  // Phase 2.5 (report.md Phase 2 plan): backend path segments renamed
  // /admin/studios* -> /admin/businesses* ("remove all remaining references
  // to old Studio tables") - these queried only dropped tables before this
  // phase, so there was no working admin-panel integration to preserve.
  // Function names kept as-is to avoid touching every admin page call site;
  // only the URLs underneath changed (same approach as Phase 2.3/2.4).
  getAdminStudios: async (params: { status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}): Promise<AdminStudiosResponse> => {
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) filteredParams[key] = String(value);
    });
    const query = new URLSearchParams(filteredParams).toString();
    return adminAuthFetch(`${API}/admin/businesses${query ? `?${query}` : ""}`);
  },

  getAdminStudio: async (id: string | number): Promise<AdminStudioResponse> => {
    return adminAuthFetch(`${API}/admin/businesses/${id}`);
  },

  updateAdminStudio: async (id: string | number, data: Record<string, unknown>): Promise<StudioActionResponse> => {
    return adminAuthFetch(`${API}/admin/businesses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  approveStudio: async (id: string | number, adminNotes?: string): Promise<StudioActionResponse> => {
    return adminAuthFetch(`${API}/admin/businesses/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ admin_notes: adminNotes })
    });
  },

  rejectStudio: async (id: string | number, reason: string, adminNotes?: string): Promise<StudioActionResponse> => {
    return adminAuthFetch(`${API}/admin/businesses/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason, admin_notes: adminNotes })
    });
  },

  suspendStudio: async (id: string | number, reason: string): Promise<StudioActionResponse> => {
    return adminAuthFetch(`${API}/admin/businesses/${id}/suspend`, {
      method: "POST",
      body: JSON.stringify({ reason })
    });
  },

  geocodeStudio: async (id: string | number, addressOverride?: { address?: string; city?: string; state?: string; country?: string }): Promise<GeocodeResponse> => {
    return adminAuthFetch(`${API}/admin/businesses/${id}/geocode`, {
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

  // New this phase (report.md Phase 2.5 plan - "User suspension" was named
  // as something to verify, but no backend route existed for it before now;
  // filling that gap is completing "User Management," not a new feature).
  suspendAdminUser: async (id: string): Promise<{ message?: string; user?: unknown } & ApiError> => {
    return adminAuthFetch(`${API}/admin/users/${id}/suspend`, { method: "PATCH" });
  },

  activateAdminUser: async (id: string): Promise<{ message?: string; user?: unknown } & ApiError> => {
    return adminAuthFetch(`${API}/admin/users/${id}/activate`, { method: "PATCH" });
  },

  getAdmins: async (): Promise<{ admins: Admin[] } & ApiError> => {
    return adminAuthFetch(`${API}/admin/admins`);
  },

  createAdmin: async (data: { name: string; email: string; password: string; role?: string }): Promise<{ message?: string; admin?: Admin } & ApiError> => {
    return adminAuthFetch(`${API}/admin/admins`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  // Phase 1.4b - admin Verification Queue.
  getVerificationQueue: async (params: { status?: string; page?: number; limit?: number } = {}): Promise<AdminVerificationQueueResponse> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== "") query.set(k, String(v)); });
    const q = query.toString();
    return adminAuthFetch(`${API}/admin/verifications${q ? `?${q}` : ""}`);
  },

  getVerificationRequest: async (id: string): Promise<{ request: AdminVerificationDetail } & ApiError> => {
    return adminAuthFetch(`${API}/admin/verifications/${id}`);
  },

  startVerificationReview: async (id: string): Promise<ApiError & { request?: unknown }> => {
    return adminAuthFetch(`${API}/admin/verifications/${id}/review`, { method: "POST" });
  },

  approveVerification: async (id: string, note?: string): Promise<ApiError & { request?: unknown }> => {
    return adminAuthFetch(`${API}/admin/verifications/${id}/approve`, { method: "POST", body: JSON.stringify({ note }) });
  },

  rejectVerification: async (id: string, reason: string): Promise<ApiError & { request?: unknown }> => {
    return adminAuthFetch(`${API}/admin/verifications/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) });
  },

  suspendVerification: async (id: string, reason: string): Promise<ApiError & { request?: unknown }> => {
    return adminAuthFetch(`${API}/admin/verifications/${id}/suspend`, { method: "POST", body: JSON.stringify({ reason }) });
  },

  requestVerificationInfo: async (id: string, reason: string): Promise<ApiError & { request?: unknown }> => {
    return adminAuthFetch(`${API}/admin/verifications/${id}/request-info`, { method: "POST", body: JSON.stringify({ reason }) });
  },

  reviewVerificationDocument: async (id: string, documentId: string, status: "accepted" | "rejected", note?: string): Promise<ApiError & { document?: unknown }> => {
    return adminAuthFetch(`${API}/admin/verifications/${id}/documents/${documentId}`, { method: "PATCH", body: JSON.stringify({ status, note }) });
  },

  addVerificationNote: async (id: string, note: string): Promise<ApiError & { note?: unknown }> => {
    return adminAuthFetch(`${API}/admin/verifications/${id}/notes`, { method: "POST", body: JSON.stringify({ note }) });
  }
};
