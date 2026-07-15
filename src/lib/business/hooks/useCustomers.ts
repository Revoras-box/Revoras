import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { BookingRow, CustomerRow, Pagination } from "../types";

export function useCustomers(studioId: string | undefined, filters: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["business", studioId, "customers", filters],
    queryFn: () =>
      businessApi
        .listCustomers(studioId as string, filters)
        .then((r) => r as { customers: CustomerRow[]; pagination: Pagination }),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}

export function useCustomerBookingHistory(
  studioId: string | undefined,
  userId: string | undefined,
  params: { page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["business", studioId, "customers", userId, "bookings", params],
    queryFn: () =>
      businessApi
        .getCustomerBookings(studioId as string, userId as string, params)
        .then((r) => r as { bookings: BookingRow[]; pagination: Pagination }),
    enabled: !!studioId && !!userId,
  });
}
