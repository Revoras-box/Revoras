import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";

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

// The structured refund schedule the cancellation engine evaluates: cancel at
// least `hoursBefore` ahead → earn `refundPercent` back (highest tier the
// customer clears wins). Legacy rows may instead carry freeBeforeHours/
// feePercentAfter; the backend normalizes both, and the form falls back to
// sensible defaults when tiers are absent.
export interface CancellationTier {
  hoursBefore: number;
  refundPercent: number;
}

export interface CancellationPolicy {
  tiers?: CancellationTier[];
  noCancelWithinHours?: number;
  freeBeforeHours?: number;
  feePercentAfter?: number;
}

export interface BusinessProfile {
  id: string;
  name: string;
  category_id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  // Phase 4A - Explore Map. Null until the owner sets a pin; required to reach
  // ACTIVE (enforced by the onboarding `location` step's completion gate).
  lat: number | null;
  lng: number | null;
  phone: string;
  email: string;
  description: string | null;
  image_url: string | null;
  logo_url: string | null;
  banner_url: string | null;
  amenities: string[];
  // Phase 1.2 - Business Information & Trust Layer
  website: string | null;
  social_links: SocialLinks;
  languages: string[];
  payment_methods: string[];
  policies: BusinessPolicies;
  cancellation_policy: CancellationPolicy;
  accessibility: string[];
  house_rules: string[];
  is_active: boolean;
}

export interface WorkingHoursDay {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface TimeOffEntry {
  id: string;
  business_member_id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  is_full_day: boolean;
  reason: string | null;
}

export function useBusinessProfile(studioId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "profile"],
    queryFn: () => businessApi.getBusiness(studioId as string).then((r) => (r as { business: BusinessProfile }).business),
    enabled: !!studioId,
    staleTime: 60_000,
  });
}

export function useUpdateBusinessProfile(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => businessApi.updateBusiness(studioId as string, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "profile"] }),
  });
}

export function useDeactivateBusiness(studioId: string | undefined) {
  return useMutation({
    mutationFn: () => businessApi.deactivateBusiness(studioId as string),
  });
}

interface WorkingHoursDayRow {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

// GET returns the raw DB row shape (snake_case); PUT's validator expects
// camelCase (see workingHours.validator.js) - the API is asymmetric, so the
// frontend normalizes on read rather than assuming one casing throughout.
const toCamelDay = (row: WorkingHoursDayRow): WorkingHoursDay => ({
  dayOfWeek: row.day_of_week,
  openTime: row.open_time,
  closeTime: row.close_time,
  isClosed: row.is_closed,
});

export function useWorkingHours(studioId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "working-hours"],
    queryFn: () =>
      businessApi
        .getWorkingHours(studioId as string)
        .then((r) => (r as { workingHours: WorkingHoursDayRow[] }).workingHours.map(toCamelDay)),
    enabled: !!studioId,
    staleTime: 60_000,
  });
}

export function useUpdateWorkingHours(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (days: WorkingHoursDay[]) => businessApi.updateWorkingHours(studioId as string, { days }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "working-hours"] }),
  });
}

/** One weekday of a professional's own rota. */
export interface MemberScheduleDay {
  dayOfWeek: number;
  startTime: string | null;
  endTime: string | null;
  isOff: boolean;
}

interface MemberScheduleRow {
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_off: boolean;
}

export interface MemberSchedule {
  /** No stored rota - this member works whenever the shop is open. */
  followsBusinessHours: boolean;
  days: MemberScheduleDay[];
  businessHours: WorkingHoursDay[];
}

export function useMemberSchedule(studioId: string | undefined, memberId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "member-schedule", memberId],
    queryFn: () =>
      businessApi.getMemberWorkingHours(studioId as string, memberId as string).then((r) => {
        const res = r as { followsBusinessHours: boolean; days: MemberScheduleRow[]; businessHours: WorkingHoursDayRow[] };
        return {
          followsBusinessHours: res.followsBusinessHours,
          days: res.days.map((row) => ({
            dayOfWeek: row.day_of_week,
            startTime: row.start_time,
            endTime: row.end_time,
            isOff: row.is_off,
          })),
          businessHours: res.businessHours.map(toCamelDay),
        } satisfies MemberSchedule;
      }),
    enabled: !!studioId && !!memberId,
  });
}

export function useUpdateMemberSchedule(studioId: string | undefined, memberId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { followsBusinessHours: boolean; days?: MemberScheduleDay[] }) =>
      businessApi.updateMemberWorkingHours(studioId as string, memberId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "member-schedule", memberId] });
      // A rota change moves which slots customers can book, so any cached
      // availability view for this studio is now stale.
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "availability"] });
    },
  });
}

export function useTimeOff(studioId: string | undefined, params: { businessMemberId?: string; date?: string; from?: string; to?: string } = {}) {
  return useQuery({
    queryKey: ["business", studioId, "time-off", params],
    queryFn: () => businessApi.listTimeOff(studioId as string, params).then((r) => (r as { timeOff: TimeOffEntry[] }).timeOff),
    enabled: !!studioId,
  });
}

export function useCreateTimeOff(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => businessApi.createTimeOff(studioId as string, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "time-off"] }),
  });
}

export function useDeleteTimeOff(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => businessApi.deleteTimeOff(studioId as string, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "time-off"] }),
  });
}
