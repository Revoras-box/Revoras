import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { BookingRow, Pagination } from "../types";

export interface BookingFilters {
  search?: string;
  from?: string;
  to?: string;
  businessMemberId?: string;
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
}

export function useBookings(studioId: string | undefined, filters: BookingFilters) {
  return useQuery({
    queryKey: ["business", studioId, "bookings", filters],
    queryFn: () =>
      businessApi
        .listBookings(studioId as string, filters)
        .then((r) => r as { bookings: BookingRow[]; pagination: Pagination }),
    enabled: !!studioId,
    staleTime: 10_000,
  });
}

const invalidateBookings = (queryClient: ReturnType<typeof useQueryClient>, studioId?: string) => {
  queryClient.invalidateQueries({ queryKey: ["business", studioId, "bookings"] });
  queryClient.invalidateQueries({ queryKey: ["business", studioId, "dashboard"] });
};

export function useRescheduleBooking(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, ...body }: { bookingId: string; bookingDate?: string; startTime?: string; businessMemberId?: string }) =>
      businessApi.rescheduleBooking(studioId as string, bookingId, body),
    onSuccess: () => invalidateBookings(queryClient, studioId),
  });
}

export function useUpdateBookingStatus(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      businessApi.updateBookingStatus(studioId as string, bookingId, status),
    onSuccess: () => invalidateBookings(queryClient, studioId),
  });
}
