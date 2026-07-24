import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.revoras.tech/api";

const TOKEN_KEY = "businessToken";
const MEMBERSHIPS_KEY = "businessMemberships";
const ACTIVE_STUDIO_KEY = "businessActiveStudioId";

export interface BusinessMembership {
  studioId: string;
  businessName: string;
  businessSlug?: string;
  approvalStatus?: string;
  isActive?: boolean;
  memberId: string;
  role: "owner" | "staff";
  designation: string | null;
  permissions: string[];
}

export interface BusinessUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url?: string | null;
}

export interface BusinessLoginResult {
  token: string;
  user: BusinessUser;
  memberships: BusinessMembership[];
}

// Phase 1.5a - host signup. hostRegister creates the account + a DRAFT business
// and returns the same session shape as login plus the freshly created business.
export interface HostRegisterInput {
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
}

export interface HostRegisterResult extends BusinessLoginResult {
  business: { id: string; name: string; business_status?: string } & Record<string, unknown>;
}

// Phase 1.5a - onboarding wizard state (mirrors onboarding.service.js getState).
export interface OnboardingStep {
  index: number;
  key: string;
  label: string;
  required: boolean;
  complete: boolean;
  comingIn?: string;
}

export interface OnboardingState {
  businessStatus: string;
  currentStep: number;
  steps: OnboardingStep[];
  completionPercent: number;
  canSubmit: boolean;
  missing: string[];
}

// Phase 4A. Mirrors the backend GeocodeResult - address components already
// mapped onto the column names the wizard uses (city/state/country/zipCode).
export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  address: {
    line1?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

export interface GeocodeSearchResult {
  results: GeocodeResult[];
  attribution: string;
}

export interface GeocodeReverseResult {
  result: GeocodeResult | null;
  attribution: string;
}

// Phase 1.1 - business gallery image row.
export interface GalleryImage {
  id: string;
  studio_id: string;
  url: string;
  sort_order: number;
  is_cover: boolean;
}

// Business document (PAN/GST/other) - compulsory onboarding upload, stored in R2.
export interface BusinessDocument {
  id: string;
  studio_id: string;
  doc_type: string;
  url: string;
  original_name: string | null;
  created_at: string;
}

// Phase 1.5d - ₹99/month subscription (mirrors businessSubscription.service.js).
export interface SubscriptionPlan {
  key: string;
  label: string;
  amount: number;
  currency: string;
  periodDays: number;
}

export interface SubscriptionRecord {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  status: "pending" | "active" | "expired" | "cancelled";
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
}

export interface SubscriptionState {
  businessStatus: string;
  /** false when the backend has no Razorpay keys set yet - show a clear "not configured" state, not a broken button. */
  configured: boolean;
  plan: SubscriptionPlan;
  active: boolean;
  current: SubscriptionRecord | null;
  history: SubscriptionRecord[];
}

export interface SubscriptionOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  subscriptionId: string;
}

export const businessAuthStorage = {
  getToken: (): string => (typeof window === "undefined" ? "" : localStorage.getItem(TOKEN_KEY) || ""),
  getMemberships: (): BusinessMembership[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(MEMBERSHIPS_KEY) || "[]");
    } catch {
      return [];
    }
  },
  getActiveStudioId: (): string | null =>
    typeof window === "undefined" ? null : localStorage.getItem(ACTIVE_STUDIO_KEY),
  setSession: (result: BusinessLoginResult, activeStudioId?: string) => {
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(result.memberships));
    localStorage.setItem("businessUser", JSON.stringify(result.user));
    localStorage.setItem(ACTIVE_STUDIO_KEY, activeStudioId || result.memberships[0]?.studioId || "");
  },
  setActiveStudioId: (studioId: string) => localStorage.setItem(ACTIVE_STUDIO_KEY, studioId),
  getUser: (): BusinessUser | null => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("businessUser") || "null");
    } catch {
      return null;
    }
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MEMBERSHIPS_KEY);
    localStorage.removeItem("businessUser");
    localStorage.removeItem(ACTIVE_STUDIO_KEY);
  },
};

type Params = Record<string, string | number | boolean | undefined>;

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const request = async <T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; params?: Params } = {}
): Promise<T> => {
  const query = options.params
    ? "?" +
      new URLSearchParams(
        Object.entries(options.params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";

  const token = businessAuthStorage.getToken();
  const res = await axios.request<T>({
    url: `${API}${path}${query}`,
    method: options.method ?? "GET",
    data: options.body,
    headers: {
      // FormData (media uploads) must not carry a manual Content-Type - axios
      // sets the multipart boundary itself. Everything else is JSON.
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    validateStatus: () => true,
  });

  if (res.status === 401 && typeof window !== "undefined") {
    businessAuthStorage.clear();
    window.location.href = "/login-barber";
    throw new ApiError(401, "Session expired");
  }

  if (res.status >= 400) {
    const message = (res.data as { error?: string })?.error || "Request failed";
    throw new ApiError(res.status, message);
  }

  return res.data;
};

/**
 * All calls scoped to the real, current backend (post-Knex-migration
 * /api/business/:studioId/* surface) - never the dead /api/studios/manage/*
 * prefix the old barber dashboard called.
 */
export const businessApi = {
  login: (data: { email?: string; phone?: string; password: string }) =>
    request<BusinessLoginResult>("/auth/business/login", { method: "POST", body: data }),

  // Phase 1.5a - host signup. Public endpoint (no token yet); the backend
  // still independently re-checks the email+phone OTP proof server-side.
  hostRegister: (data: HostRegisterInput) =>
    request<HostRegisterResult>("/auth/host/register", { method: "POST", body: data }),

  getDashboard: (studioId: string) => request<{ dashboard: Record<string, unknown> }>(`/business/${studioId}/dashboard`),

  getAnalytics: (studioId: string, params: { period?: string; page?: number; limit?: number }) =>
    request(`/business/${studioId}/analytics`, { params }),

  listBookings: (
    studioId: string,
    params: {
      search?: string;
      from?: string;
      to?: string;
      businessMemberId?: string;
      status?: string;
      paymentStatus?: string;
      page?: number;
      limit?: number;
    }
  ) => request(`/business/${studioId}/bookings`, { params }),

  rescheduleBooking: (
    studioId: string,
    bookingId: string,
    body: { bookingDate?: string; startTime?: string; businessMemberId?: string }
  ) => request(`/business/${studioId}/bookings/${bookingId}`, { method: "PATCH", body }),

  updateBookingStatus: (studioId: string, bookingId: string, status: string) =>
    request(`/business/${studioId}/bookings/${bookingId}/status`, { method: "PATCH", body: { status } }),

  listCustomers: (studioId: string, params: { search?: string; page?: number; limit?: number }) =>
    request(`/business/${studioId}/customers`, { params }),

  getCustomerBookings: (studioId: string, userId: string, params: { page?: number; limit?: number }) =>
    request(`/business/${studioId}/customers/${userId}/bookings`, { params }),

  listMembers: (studioId: string) => request(`/business/${studioId}/members`),
  addMember: (studioId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}/members`, { method: "POST", body }),
  updateMember: (studioId: string, memberId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}/members/${memberId}`, { method: "PATCH", body }),
  removeMember: (studioId: string, memberId: string) =>
    request(`/business/${studioId}/members/${memberId}`, { method: "DELETE" }),

  // Team invites - for professionals who don't have a Revoras account yet.
  // addMember above still covers the case where they already do.
  listInvites: (studioId: string) => request(`/business/${studioId}/invites`),
  createInvite: (studioId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}/invites`, { method: "POST", body }),
  resendInvite: (studioId: string, inviteId: string) =>
    request(`/business/${studioId}/invites/${inviteId}/resend`, { method: "POST" }),
  revokeInvite: (studioId: string, inviteId: string) =>
    request(`/business/${studioId}/invites/${inviteId}`, { method: "DELETE" }),

  listServices: (studioId: string, params: { activeOnly?: boolean }) =>
    request(`/business/${studioId}/services`, { params }),
  createService: (studioId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}/services`, { method: "POST", body }),
  updateService: (studioId: string, serviceId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}/services/${serviceId}`, { method: "PATCH", body }),
  deactivateService: (studioId: string, serviceId: string) =>
    request(`/business/${studioId}/services/${serviceId}`, { method: "DELETE" }),
  // Uploads a service photo (FormData "file") and returns its URL; the form then
  // sends that url as `imageUrl` on createService/updateService.
  uploadServiceImage: (studioId: string, form: FormData) =>
    request<{ url: string }>(`/business/${studioId}/services/image`, { method: "POST", body: form }),
  listCategories: (type: "service" | "business" = "service") => request(`/categories`, { params: { type } }),

  // Phase 2.4 (Offers & Promotions)
  listOffers: (studioId: string) => request(`/business/${studioId}/offers`),
  createOffer: (studioId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}/offers`, { method: "POST", body }),
  updateOffer: (studioId: string, offerId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}/offers/${offerId}`, { method: "PATCH", body }),
  deleteOffer: (studioId: string, offerId: string) =>
    request(`/business/${studioId}/offers/${offerId}`, { method: "DELETE" }),

  listPayments: (studioId: string, params: { status?: string; from?: string; to?: string; page?: number; limit?: number }) =>
    request(`/business/${studioId}/payments`, { params }),

  getWorkingHours: (studioId: string) => request(`/business/${studioId}/working-hours`),
  updateWorkingHours: (studioId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}/working-hours`, { method: "PUT", body }),
  listTimeOff: (studioId: string, params: { businessMemberId?: string; date?: string; from?: string; to?: string }) =>
    request(`/business/${studioId}/time-off`, { params }),
  createTimeOff: (studioId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}/time-off`, { method: "POST", body }),
  deleteTimeOff: (studioId: string, id: string) => request(`/business/${studioId}/time-off/${id}`, { method: "DELETE" }),

  getBusiness: (studioId: string) => request(`/business/${studioId}`),
  updateBusiness: (studioId: string, body: Record<string, unknown>) =>
    request(`/business/${studioId}`, { method: "PATCH", body }),
  deactivateBusiness: (studioId: string) => request(`/business/${studioId}`, { method: "DELETE" }),

  // Phase 1.3b - professional portfolio media. Uploads pass FormData; the
  // frontend never knows the storage provider (Controller → MediaService → R2).
  listPortfolio: (studioId: string, memberId: string) =>
    request(`/business/${studioId}/members/${memberId}/portfolio`),
  addPortfolioImage: (studioId: string, memberId: string, form: FormData) =>
    request(`/business/${studioId}/members/${memberId}/portfolio`, { method: "POST", body: form }),
  reorderPortfolio: (studioId: string, memberId: string, orderedImageIds: string[]) =>
    request(`/business/${studioId}/members/${memberId}/portfolio/reorder`, { method: "PATCH", body: { orderedImageIds } }),
  setPortfolioCover: (studioId: string, memberId: string, imageId: string) =>
    request(`/business/${studioId}/members/${memberId}/portfolio/${imageId}/cover`, { method: "PATCH" }),
  updatePortfolioCaption: (studioId: string, memberId: string, imageId: string, caption: string) =>
    request(`/business/${studioId}/members/${memberId}/portfolio/${imageId}`, { method: "PATCH", body: { caption } }),
  deletePortfolioImage: (studioId: string, memberId: string, imageId: string) =>
    request(`/business/${studioId}/members/${memberId}/portfolio/${imageId}`, { method: "DELETE" }),

  // Phase 1.3b - professional certificates (metadata + optional image via FormData).
  listCertificates: (studioId: string, memberId: string) =>
    request(`/business/${studioId}/members/${memberId}/certificates`),
  addCertificate: (studioId: string, memberId: string, form: FormData) =>
    request(`/business/${studioId}/members/${memberId}/certificates`, { method: "POST", body: form }),
  updateCertificate: (studioId: string, memberId: string, certId: string, form: FormData) =>
    request(`/business/${studioId}/members/${memberId}/certificates/${certId}`, { method: "PATCH", body: form }),
  deleteCertificate: (studioId: string, memberId: string, certId: string) =>
    request(`/business/${studioId}/members/${memberId}/certificates/${certId}`, { method: "DELETE" }),

  // Phase 1.3d - self-service (/me/*). studioId is a query param throughout so
  // the same request shape works for JSON and multipart, and the backend
  // resolves the caller's own membership.
  meGetProfile: (studioId: string) => request(`/me/profile`, { params: { studioId } }),
  meUpdateProfile: (studioId: string, body: Record<string, unknown>) =>
    request(`/me/profile`, { method: "PATCH", params: { studioId }, body }),
  meListPortfolio: (studioId: string) => request(`/me/portfolio`, { params: { studioId } }),
  meAddPortfolioImage: (studioId: string, form: FormData) =>
    request(`/me/portfolio`, { method: "POST", params: { studioId }, body: form }),
  meReorderPortfolio: (studioId: string, orderedImageIds: string[]) =>
    request(`/me/portfolio/reorder`, { method: "PATCH", params: { studioId }, body: { orderedImageIds } }),
  meSetPortfolioCover: (studioId: string, imageId: string) =>
    request(`/me/portfolio/${imageId}/cover`, { method: "PATCH", params: { studioId } }),
  meUpdatePortfolioCaption: (studioId: string, imageId: string, caption: string) =>
    request(`/me/portfolio/${imageId}`, { method: "PATCH", params: { studioId }, body: { caption } }),
  meDeletePortfolioImage: (studioId: string, imageId: string) =>
    request(`/me/portfolio/${imageId}`, { method: "DELETE", params: { studioId } }),
  meListCertificates: (studioId: string) => request(`/me/certificates`, { params: { studioId } }),
  meAddCertificate: (studioId: string, form: FormData) =>
    request(`/me/certificates`, { method: "POST", params: { studioId }, body: form }),
  meUpdateCertificate: (studioId: string, certId: string, form: FormData) =>
    request(`/me/certificates/${certId}`, { method: "PATCH", params: { studioId }, body: form }),
  meDeleteCertificate: (studioId: string, certId: string) =>
    request(`/me/certificates/${certId}`, { method: "DELETE", params: { studioId } }),

  // Phase 1.4b - Verification Center. Reads return the business-facing view
  // (no internal admin notes). Document upload passes FormData.
  getVerification: (studioId: string) => request<import("@/lib/types").VerificationCenter>(`/business/${studioId}/verification`),
  getVerificationEligibility: (studioId: string) =>
    request<import("@/lib/types").Eligibility>(`/business/${studioId}/verification/eligibility`),
  createVerificationRequest: (studioId: string, body: { applicantNote?: string }) =>
    request(`/business/${studioId}/verification`, { method: "POST", body }),
  addVerificationDocument: (studioId: string, requestId: string, form: FormData) =>
    request(`/business/${studioId}/verification/${requestId}/documents`, { method: "POST", body: form }),
  removeVerificationDocument: (studioId: string, requestId: string, documentId: string) =>
    request(`/business/${studioId}/verification/${requestId}/documents/${documentId}`, { method: "DELETE" }),
  submitVerificationRequest: (studioId: string, requestId: string) =>
    request(`/business/${studioId}/verification/${requestId}/submit`, { method: "POST" }),

  // Phase 1.1 - business gallery. Uploads pass FormData ("file"); the frontend
  // never knows the storage provider (Controller -> MediaService -> R2).
  listGallery: (studioId: string) =>
    request<{ images: GalleryImage[] }>(`/business/${studioId}/gallery`),
  addGalleryImage: (studioId: string, form: FormData) =>
    request<{ image: GalleryImage }>(`/business/${studioId}/gallery`, { method: "POST", body: form }),
  removeGalleryImage: (studioId: string, imageId: string) =>
    request<{ images: GalleryImage[] }>(`/business/${studioId}/gallery/${imageId}`, { method: "DELETE" }),

  // Business documents (PAN/GST/other). Upload passes FormData ("file" + "docType").
  listDocuments: (studioId: string) =>
    request<{ documents: BusinessDocument[] }>(`/business/${studioId}/documents`),
  addDocument: (studioId: string, form: FormData) =>
    request<{ document: BusinessDocument }>(`/business/${studioId}/documents`, { method: "POST", body: form }),
  removeDocument: (studioId: string, documentId: string) =>
    request<{ documents: BusinessDocument[] }>(`/business/${studioId}/documents/${documentId}`, { method: "DELETE" }),
  setGalleryCover: (studioId: string, imageId: string) =>
    request<{ images: GalleryImage[] }>(`/business/${studioId}/gallery/${imageId}/cover`, { method: "PATCH" }),
  reorderGallery: (studioId: string, orderedImageIds: string[]) =>
    request<{ images: GalleryImage[] }>(`/business/${studioId}/gallery/reorder`, { method: "PATCH", body: { orderedImageIds } }),

  // Phase 1.5a - onboarding wizard. getOnboarding returns computed progress +
  // resume cursor; saveOnboardingStep persists Basics/Information fields and the
  // cursor; submitOnboarding transitions DRAFT/ONBOARDING -> PAYMENT_PENDING via
  // BusinessLifecycleService (never a direct status write).
  getOnboarding: (studioId: string) => request<OnboardingState>(`/business/${studioId}/onboarding`),
  saveOnboardingStep: (studioId: string, body: { step?: number; data?: Record<string, unknown> }) =>
    request<OnboardingState & { message: string }>(`/business/${studioId}/onboarding`, { method: "PATCH", body }),
  submitOnboarding: (studioId: string) =>
    request<{ message: string; businessStatus: string }>(`/business/${studioId}/onboarding/submit`, { method: "POST" }),

  // Phase 1.5d - ₹99/month subscription. createSubscriptionOrder/verifySubscriptionPayment
  // mirror the customer checkout pattern (api.createPaymentOrder/verifyPayment) against a
  // business-scoped endpoint instead of a booking. The Razorpay webhook path (authoritative
  // even if the client never calls verify) has no frontend surface - it's server-to-server.
  getSubscription: (studioId: string) => request<SubscriptionState>(`/business/${studioId}/subscription`),
  createSubscriptionOrder: (studioId: string) =>
    request<SubscriptionOrder>(`/business/${studioId}/subscription/order`, { method: "POST" }),
  verifySubscriptionPayment: (
    studioId: string,
    body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
  ) =>
    request<{ message: string; verified: boolean; businessStatus: string }>(
      `/business/${studioId}/subscription/verify`,
      { method: "POST", body }
    ),
  // TEMPORARY: activate without payment while no gateway is live.
  activateSubscriptionFree: (studioId: string) =>
    request<{ message: string; active: boolean; businessStatus: string }>(
      `/business/${studioId}/subscription/activate-free`,
      { method: "POST" }
    ),

  listReviews: (
    studioId: string,
    params: { rating?: number; sortBy?: string; awaitingReply?: boolean; page?: number; limit?: number }
  ) => request(`/reviews/business/${studioId}`, { params }),

  // Reviews are read from the public endpoint above, but the business's reply is
  // written on the business-scoped router where reviews.respond is enforced.
  replyToReview: (studioId: string, reviewId: string, reply: string) =>
    request(`/business/${studioId}/reviews/${reviewId}/reply`, { method: "PUT", body: { reply } }),
  deleteReviewReply: (studioId: string, reviewId: string) =>
    request(`/business/${studioId}/reviews/${reviewId}/reply`, { method: "DELETE" }),

  listNotifications: (params: { unreadOnly?: boolean; page?: number; limit?: number }) =>
    request(`/notifications`, { params }),
  getUnreadNotificationCount: () => request<{ count: number }>(`/notifications/unread-count`),
  markNotificationRead: (id: string) => request(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => request(`/notifications/read-all`, { method: "PATCH" }),

  // Phase 4A (Explore Map - Location Foundation). Address <-> coordinate
  // lookups for the onboarding Location step and the profile pin editor. Both
  // hit the backend proxy (never Nominatim directly - see the backend's
  // geocoding.service.js) and share the same JWT the rest of businessApi uses.
  geocodeSearch: (q: string, limit?: number) =>
    request<GeocodeSearchResult>(`/geocoding/search`, { params: { q, limit } }),
  geocodeReverse: (lat: number, lng: number) =>
    request<GeocodeReverseResult>(`/geocoding/reverse`, { params: { lat, lng } }),
};
