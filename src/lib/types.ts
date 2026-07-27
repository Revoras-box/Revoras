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
// Discover / Customer Types
//
// Backend returns Postgres `decimal` columns (price, rating) as strings via
// Knex, not numbers - typed as `string` here to match the wire shape; cast
// with Number() at the point of display/use, same as the backend itself
// does internally (e.g. profile.service.js does Number(stats.total_spent)).
// ==========================================

// Phase 1.4c - a derived trust/quality badge. `key` is stable (for styling/
// icons), `label` is display text. See TrustBadges component.
export interface TrustBadge {
  key: string;
  label: string;
}

// Phase 1.4a/b - public trust signals attached to a business detail. Only safe
// fields (no verification documents/notes).
export interface TrustSignals {
  score: number;
  band: "Excellent" | "Great" | "Good" | "Fair" | "Building";
  verified: boolean;
  rating: string | number;
  review_count: number;
  completed_bookings: number;
  cancellation_rate: string | number;
  no_show_rate: string | number;
  profile_completion: number;
  avg_response_minutes: number | null;
  business_age_days: number;
  computed_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string | null;
  state: string | null;
  lat: number | null;
  lng: number | null;
  image_url: string | null;
  rating: string | null;
  review_count: number;
  amenities: string[];
  category_name: string | null;
  category_slug: string | null;
  distance_km?: number;
  // Phase 1.4c - discovery ranking + badges on each card.
  badges?: TrustBadge[];
  rankScore?: number;
  verified?: boolean;
  // Phase 2.4 - offer badge summary (null when the business has no live offer).
  offer?: OfferSummary | null;
}

// Phase 2.4 (Offers & Promotions)
export interface OfferSummary {
  count: number;
  bestLabel: string;
  bestType: "flat" | "percentage";
  bestValue: number;
}

/** Pre-booking price quote (POST /bookings/quote): what the customer will pay and which offer applies. */
export interface BookingQuoteResponse {
  quote?: {
    originalAmount: number;
    discountAmount: number;
    total: number;
    offer: { id: string; title: string; label: string } | null;
  };
  error?: string;
}

/** A live offer as shown on the business detail page's offer section. */
export interface PublicOffer {
  id: string;
  title: string;
  description: string | null;
  discountType: "flat" | "percentage";
  discountValue: number;
  maxDiscountAmount: number | null;
  minSpend: number | null;
  appliesTo: "business" | "services";
  serviceIds: string[];
  label: string;
}

export interface BusinessesResponse {
  businesses: Business[];
  pagination: Pagination;
  error?: string;
}

// Phase 2.2 (Discovery Curation System) - editorial collections.
export interface Collection {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  coverImageUrl: string | null;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  startAt: string | null;
  endAt: string | null;
  targetCity: string | null;
  targetState: string | null;
  filterCategoryId: string | null;
  filterMinRating: number | null;
  filterVerifiedOnly: boolean;
  filterPremiumOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionsResponse {
  collections: Collection[];
  error?: string;
}

export interface CollectionResponse {
  collection: Collection;
  businesses: Business[];
  pagination: Pagination;
  error?: string;
}

export interface MapPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string | null;
  rating: string | null;
  review_count: number;
  image_url: string | null;
  distance_km?: number;
}

export interface BusinessesMapResponse {
  businesses: MapPin[];
  error?: string;
}

export interface WorkingHour {
  id: number;
  studio_id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

/**
 * Why a date has no bookable slots. The server knows which of these applies -
 * "the shop is shut on Sundays" and "she's booked solid" need very different
 * copy, and guessing client-side gets it wrong.
 */
export type AvailabilityReason =
  | "business_closed"
  | "member_off"
  | "time_off"
  | "fully_booked"
  | "day_ended"
  | "duration_exceeds_shift";

/**
 * Per-slot state. `insufficient_time` is the only one the customer can act on —
 * the slot is free, but the services they picked don't fit before the next
 * appointment — so the UI treats it as a prompt to trim, not as a dead end.
 */
export type SlotStatus = "available" | "booked" | "blocked" | "past" | "insufficient_time";

export interface AvailabilitySlot {
  /** Start time as "HH:MM". */
  time: string;
  status: SlotStatus;
  available: boolean;
  /** Contiguous free minutes from this start — 0 when the slot is taken. */
  maxDuration: number;
  /** When a free window closes ("HH:MM"): the next appointment, or the end of the shift. */
  freeUntil?: string;
  /** When a taken slot frees up ("HH:MM"). */
  freeAt?: string;
  /** What caps the window — another booking, the professional's time off, or the shift end. */
  limitedBy?: "booked" | "blocked" | "shift_end";
}

export interface AvailabilityResponse {
  /** Bookable start times as "HH:MM", already filtered by hours, rota, bookings and time off. */
  slots: string[];
  /** Every grid position in the shift, including taken ones, so the day's shape is visible. */
  grid?: AvailabilitySlot[];
  available: boolean;
  reason: AvailabilityReason | null;
  /** The professional's effective window for the date; null when they aren't working. */
  shift: { start: string; end: string; source: "business" | "member" } | null;
  /** Total minutes the requested services occupy. */
  duration?: number;
  /**
   * Minutes between start times. Derived from the shortest service the business
   * sells, so no gap big enough to sell is skipped — not a fixed half hour.
   */
  interval?: number;
  /** Where `interval` came from — the catalogue, or the business's fallback setting. */
  intervalSource?: "shortest_service" | "business_setting";
  /** The shortest active service in minutes; null when the business has none yet. */
  shortestServiceDuration?: number | null;
  /** The longest appointment that could start anywhere on this date. */
  longestFreeWindow?: number;
  error?: string;
}

export interface AvailabilityDay {
  date: string;
  available: boolean;
  slotCount: number;
  firstSlot: string | null;
  reason: AvailabilityReason | null;
}

export interface Service {
  id: string;
  studio_id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  category_name: string | null;
  category_slug: string | null;
  price: string;
  duration: number;
  image_url: string | null;
  is_active: boolean;
}

export interface Professional {
  id: string; // business_members.id — this is the `businessMemberId` used for availability/booking
  name: string;
  designation: string | null;
  specialties: string[];
  experience_years: number | null;
  rating: string | null;
  image_url: string | null;
  badges?: TrustBadge[]; // Phase 1.4c
}

// Phase 1.2 - Business Information & Trust Layer. Mirrors the jsonb columns on
// `businesses` (backend migration 20260714000002). All optional/defaulted, so a
// business with no profile detail comes back with empty arrays/objects.
export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface BusinessPolicies {
  cancellation?: string;
  rescheduling?: string;
  refund?: string;
  general?: string;
}

export interface BusinessDetail {
  id: string;
  name: string;
  slug: string;
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
  logo_url: string | null;
  banner_url: string | null;
  amenities: string[];
  website: string | null;
  social_links: SocialLinks;
  languages: string[];
  payment_methods: string[];
  policies: BusinessPolicies;
  accessibility: string[];
  house_rules: string[];
  rating: string | null;
  review_count: number;
  category_name: string | null;
  category_slug: string | null;
  services: Service[];
  professionals: Professional[];
  workingHours: WorkingHour[];
  // Phase 1.4a/b/c - trust signals + derived badges on the detail.
  trust?: TrustSignals;
  badges?: TrustBadge[];
  // Phase 2.4 - live offers for this business.
  offers?: PublicOffer[];
  // Photos uploaded through the business dashboard's gallery manager - the
  // actual source of truth for storefront photos (banner_url/image_url/logo_url
  // are separate, often-unpopulated legacy fields).
  gallery?: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  url: string;
  sort_order: number;
  is_cover: boolean;
}

export interface BusinessResponse {
  business: BusinessDetail;
  error?: string;
}

export interface ServicesResponse {
  services: Service[];
  error?: string;
}

export interface ProfessionalsResponse {
  professionals: Professional[];
  error?: string;
}

// Phase 1.3 - Professional Profile Enhancement (business_members jsonb columns).
export interface EducationItem {
  institution: string;
  degree?: string;
  year?: string;
}
export interface AwardItem {
  title: string;
  year?: string;
}
export interface ProfessionalSocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;
}

// Phase 1.3b - professional media (member_portfolio / member_certificates).
export interface PortfolioImage {
  id: string;
  media_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  sort_order: number;
  is_cover: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issued_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  verification_url: string | null;
  media_url: string | null;
  sort_order: number;
}

export interface ProfessionalDetail extends Professional {
  studio_id: string;
  business_id: string;
  business_name: string;
  provides_services: boolean;
  bio: string | null;
  languages: string[];
  education: EducationItem[];
  awards: AwardItem[];
  social_links: ProfessionalSocialLinks;
  featured_service_ids: string[];
  portfolio: PortfolioImage[];
  certificates: Certificate[];
}

export interface ProfessionalResponse {
  professional: ProfessionalDetail;
  error?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  type: "business" | "service";
  sort_order: number;
}

export interface CategoriesResponse {
  categories: Category[];
  error?: string;
}

// ============================================================================
// Phase 1.4b - Business trust verification (distinct from signup OTP).
// Shared shapes used by both the business Verification Center and the admin
// Verification Queue. The business-facing shapes NEVER include internal notes.
// ============================================================================

export type VerificationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "more_info"
  | "approved"
  | "rejected"
  | "suspended";

export type VerificationDocumentType = "business_license" | "id_proof" | "address_proof" | "tax_document" | "other";

export interface VerificationDocument {
  id: string;
  type: VerificationDocumentType;
  url: string;
  originalName?: string | null;
  original_name?: string | null;
  status: "pending" | "accepted" | "rejected";
  reviewNote?: string | null;
  review_note?: string | null;
  createdAt?: string;
  created_at?: string;
}

export interface VerificationHistoryEntry {
  id: string;
  from_status: VerificationStatus | null;
  to_status: VerificationStatus;
  actor_type: "business" | "admin" | "system";
  actor_id: string | null;
  note: string | null;
  created_at: string;
}

export interface EligibilityCriterion {
  key: string;
  label: string;
  required: number;
  current: number;
  met: boolean;
}

export interface Eligibility {
  eligible: boolean;
  criteria: EligibilityCriterion[];
}

// Business-facing current request (camelCase, no internal notes).
export interface VerificationRequestPublic {
  id: string;
  status: VerificationStatus;
  applicantNote: string | null;
  decisionReason: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  documents: VerificationDocument[];
}

export interface VerificationCenter {
  verified: boolean;
  eligibility: Eligibility;
  canStart: boolean;
  currentRequest: VerificationRequestPublic | null;
  history: VerificationHistoryEntry[];
}

// Admin-facing shapes.
export interface AdminVerificationRow {
  id: string;
  business_id: string;
  status: VerificationStatus;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
  business_name: string;
  business_city: string | null;
  business_approval_status: string;
}

export interface VerificationNote {
  id: string;
  note: string;
  created_at: string;
  admin_id: string | null;
  admin_name: string | null;
}

export interface AdminVerificationDetail {
  id: string;
  business_id: string;
  status: VerificationStatus;
  eligibility_snapshot: Eligibility | Record<string, unknown>;
  applicant_note: string | null;
  decision_reason: string | null;
  reviewed_by: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  documents: VerificationDocument[];
  history: VerificationHistoryEntry[];
  notes: VerificationNote[];
}

export interface AdminVerificationQueueResponse {
  requests: AdminVerificationRow[];
  counts: Partial<Record<VerificationStatus, number>>;
  pagination: Pagination;
  error?: string;
}

export interface Review {
  id: string;
  user_id: string;
  booking_id: string;
  studio_id: string;
  business_member_id: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  photos: string[];
  helpful_count: number;
  created_at: string;
  customer_name: string;
  customer_avatar: string | null;
}

export interface ReviewStats {
  total: number;
  averageRating: number;
  distribution?: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
  pagination: Pagination;
  error?: string;
}

export type BookingStatus = "pending" | "confirmed" | "checked_in" | "completed" | "cancelled" | "no_show";

// Phase 2.5 (Booking Experience)
export interface BookingTimelineEvent {
  id: string;
  booking_id: string;
  from_status: BookingStatus | null;
  to_status: BookingStatus;
  actor_type: "customer" | "business" | "system";
  actor_id: string | null;
  reason: string | null;
  created_at: string;
}

export interface CancellationQuote {
  cancellable: boolean;
  tier: "free" | "fee" | "blocked" | "terminal";
  feePercent: number;
  feeAmount: number;
  refundAmount: number;
  hoursUntil: number;
  // `tiers` is the full refund schedule; `freeBeforeHours`/`feePercentAfter` are
  // a backward-compatible single-tier summary the engine derives from it.
  policy: {
    tiers?: { hoursBefore: number; refundPercent: number }[];
    freeBeforeHours: number;
    feePercentAfter: number;
    noCancelWithinHours: number;
  };
  message: string;
}
export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";

export interface BookingService {
  id: string;
  name: string;
  price: string;
  duration: number;
}

export interface BookingListItem {
  id: string;
  studio_id: string;
  business_member_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: string;
  total_duration: number;
  notes: string | null;
  status: BookingStatus;
  confirmation_code: string;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
  payment_status: PaymentStatus;
  studio_name: string;
  studio_address: string;
  studio_image: string | null;
  member_name: string;
  member_designation: string | null;
  member_image: string | null;
  // Phase 2.4/2.5
  original_amount: string | null;
  discount_amount: string | null;
  cancellation_fee: string | null;
  offer_id: string | null;
  /** Legal next transitions from the state machine — drives which actions render. */
  allowedNextStatuses?: BookingStatus[];
}

export interface BookingsResponse {
  bookings: BookingListItem[];
  pagination: Pagination;
  error?: string;
}

export interface BookingDetail extends BookingListItem {
  studio_phone: string | null;
  lat: number | null;
  lng: number | null;
  member_rating: string | null;
  services: BookingService[];
  // Phase 2.5 - legal next transitions from the state machine.
  allowedNextStatuses?: BookingStatus[];
}

export interface BookingTimelineResponse {
  timeline: BookingTimelineEvent[];
  error?: string;
}

export interface CancellationQuoteResponse {
  quote: CancellationQuote;
  error?: string;
}

export interface BookingResponse {
  booking: BookingDetail;
  error?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "booking_created" | "booking_confirmed" | "booking_cancelled" | "booking_reminder" | "payment_received";
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  channel: string;
  status: string;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: Pagination;
  error?: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  preferences: Record<string, unknown>;
  notification_settings: { email: boolean; push: boolean; sms: boolean; marketing: boolean };
  created_at: string;
  updated_at: string;
}

export interface ProfileStats {
  totalBookings: number;
  completedBookings: number;
  totalSpent: number;
  loyaltyPoints: number;
}

export interface ProfileResponse {
  user: Profile;
  stats: ProfileStats;
  error?: string;
}

export interface FavoriteCard {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  rating: string | null;
  review_count: number;
  city: string | null;
  address: string;
  favorited_at: string;
}

export interface FavoritesResponse {
  favorites: FavoriteCard[];
  error?: string;
}

// Phase 2.3 (Favorites & Recently Viewed)

/**
 * Id-only projection of everything the user has favorited — what fills the
 * heart on discovery cards without shipping a full card per favorite.
 * `memberIds` are business_members ids (same id space as `Professional.id`).
 */
export interface FavoriteIdsResponse {
  studioIds: string[];
  memberIds: string[];
  error?: string;
}

/** A favorited/recently-viewed professional: `Professional` plus its business. */
export interface ProfessionalCardData extends Professional {
  business_id: string;
  business_name: string;
  favorited_at?: string;
  viewed_at?: string;
}

export interface FavoriteProfessionalsResponse {
  professionals: ProfessionalCardData[];
  error?: string;
}

/** Same card shape as FavoriteCard, ordered by view recency rather than save time. */
export interface RecentlyViewedCard extends Omit<FavoriteCard, "favorited_at"> {
  viewed_at: string;
}

export interface RecentlyViewedResponse {
  businesses: RecentlyViewedCard[];
  error?: string;
}

