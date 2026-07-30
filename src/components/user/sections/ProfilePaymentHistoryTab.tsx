"use client";

import { useState } from "react";
import { DataTable, Badge, Pagination } from "@/components/ui";
import type { DataTableColumn } from "@/components/ui";
import { useBookings } from "@/lib/hooks";
import type { BookingListItem, PaymentStatus } from "@/lib/types";
import { formatBookingDateLabel } from "./utils";
import { ProfileSection } from "./ProfileSection";

const PAYMENT_TONE: Record<PaymentStatus, "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  unpaid: "neutral",
  failed: "danger",
  refunded: "neutral",
};

const columns: DataTableColumn<BookingListItem>[] = [
  { key: "date", header: "Date", render: (row) => formatBookingDateLabel(row.booking_date) },
  { key: "studio", header: "Studio", render: (row) => row.studio_name },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    render: (row) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(row.total_amount)),
  },
  {
    key: "status",
    header: "Payment",
    render: (row) => <Badge tone={PAYMENT_TONE[row.payment_status]}>{row.payment_status}</Badge>,
  },
];

export default function ProfilePaymentHistoryTab() {
  const [page, setPage] = useState(1);
  const { data, loading } = useBookings({ page: String(page), limit: "10" });
  const bookings = data?.bookings ?? [];
  const pagination = data?.pagination;

  return (
    <ProfileSection title="Payment history" description="Every booking you've paid for, most recent first.">
      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        rowKey={(row) => row.id}
        emptyTitle="No payment history yet"
      />
      {pagination && pagination.pages > 1 ? (
        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
      ) : null}
    </ProfileSection>
  );
}
