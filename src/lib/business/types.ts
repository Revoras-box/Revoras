export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DashboardData {
  today: { bookings: BookingRow[]; bookingsCount: number; revenue: number };
  upcomingBookings: BookingRow[];
  revenue: { today: number; thisWeek: number; lastWeek: number; weekChangePercent: number };
  popularServices: { id: string; name: string; bookingsCount: number; revenue: number }[];
  activeProfessionals: {
    id: string;
    name: string;
    designation: string | null;
    rating: number;
    imageUrl: string | null;
    todayBookingsCount: number;
  }[];
  bookingStatusCounts: Record<string, number>;
  newCustomersCount: number;
  averageRating: number;
}

export type BookingStatus = "pending" | "confirmed" | "checked_in" | "completed" | "cancelled" | "no_show";

export interface BookingRow {
  id: string;
  status: BookingStatus;
  // Phase 2.5 - legal next transitions from the state machine (drives action buttons).
  allowedNextStatuses?: BookingStatus[];
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: string | number;
  total_duration?: number;
  confirmation_code: string;
  notes?: string | null;
  cancellation_reason?: string | null;
  customer_id?: string;
  customer_name: string;
  customer_phone?: string | null;
  customer_image?: string | null;
  business_member_id: string;
  member_designation: string | null;
  member_name: string;
  payment_status: "unpaid" | "pending" | "paid" | "failed" | "refunded";
  services?: { name: string; price: number; duration: number }[];
}

export interface CustomerRow {
  id: string;
  name: string;
  phone: string | null;
  imageUrl: string | null;
  visitsCount: number;
  totalSpent: number;
  firstVisit: string;
  lastVisit: string;
}

export interface EducationItem {
  institution: string;
  degree?: string;
  year?: string;
}
export interface AwardItem {
  title: string;
  year?: string;
}
export interface MemberSocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;
}

// Phase 1.3d - one hook layer, two scopes. Owner manages a member's media via
// /members/:id/*; a professional manages their own via /me/*. The scope drives
// which endpoint the shared hooks/components call - no duplicated API logic.
export type MediaScope =
  | { mode: "owner"; studioId: string; memberId: string }
  | { mode: "self"; studioId: string };

// Phase 1.3b - Professional portfolio & certificate media (member_portfolio /
// member_certificates rows).
export interface PortfolioImage {
  id: string;
  business_member_id: string;
  media_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  sort_order: number;
  is_cover: boolean;
}

export interface Certificate {
  id: string;
  business_member_id: string;
  title: string;
  issuer: string;
  issued_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  verification_url: string | null;
  media_url: string | null;
  sort_order: number;
}

export interface BusinessMemberRow {
  id: string;
  user_id: string;
  name: string;
  designation: string | null;
  role_id: string;
  role: string;
  status: "invited" | "active" | "inactive" | "suspended";
  provides_services: boolean;
  specialties: string[];
  experience_years: number;
  rating: number;
  image_url: string | null;
  // Phase 1.3 - Professional Profile Enhancement
  bio: string | null;
  languages: string[];
  education: EducationItem[];
  awards: AwardItem[];
  social_links: MemberSocialLinks;
  featured_service_ids: string[];
  profile_completion?: number;
  profile_missing?: string[];
}

export interface ServiceRow {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  category_name?: string;
  price: number;
  duration: number;
  image_url: string | null;
  is_active: boolean;
}

// Phase 2.4 (Offers & Promotions)
export type OfferStatus = "active" | "scheduled" | "expired" | "inactive";

export interface OfferRow {
  id: string;
  studioId: string;
  title: string;
  description: string | null;
  discountType: "flat" | "percentage";
  discountValue: number;
  maxDiscountAmount: number | null;
  minSpend: number | null;
  appliesTo: "business" | "services";
  serviceIds: string[];
  startAt: string | null;
  endAt: string | null;
  isActive: boolean;
  maxUses: number | null;
  maxUsesPerUser: number | null;
  firstTimeOnly: boolean;
  status: OfferStatus;
  usageCount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRow {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  verifiedAt: string | null;
  createdAt: string;
  bookingId: string;
  bookingDate: string;
  confirmationCode: string;
  customerName: string;
}

export interface PaymentsSummary {
  totalPaid: number;
  totalRefunded: number;
  totalPending: number;
  totalCount: number;
}

export interface AnalyticsData {
  period: string;
  totals: { bookings: number; revenue: number; avgTicket: number };
  revenueOverTime: { bucket: string; revenue: number; bookingsCount: number }[];
  topServices: { id: string; name: string; bookingsCount: number; revenue: number }[];
  peakHours: { hour: number; bookingsCount: number }[];
  memberPerformance: {
    members: { id: string; name: string; designation: string | null; status: string; bookingsCount: number; revenue: number }[];
    pagination: Pagination;
  };
  reviews: { total: number; avgRating: number; distribution: Record<string, number> };
}

export interface ReviewRow {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  helpful_count: number;
  created_at: string;
  customer_name: string;
  customer_avatar: string | null;
}

export interface NotificationRow {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
