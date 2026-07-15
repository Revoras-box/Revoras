"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";
import { useBusinessAuth } from "@/lib/business/auth";
import { useBookings, type BookingFilters } from "@/lib/business/hooks/useBookings";
import { useMembers } from "@/lib/business/hooks/useMembers";
import { useDebouncedValue } from "@/lib/business/useDebouncedValue";
import { hasPermission, PERMISSIONS } from "@/lib/business/permissions";
import { BookingDetailDrawer } from "@/components/business/BookingDetailDrawer";
import type { BookingRow } from "@/lib/business/types";
import { formatINR } from "@/lib/format";

const STATUS_TONE: Record<string, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "primary",
  checked_in: "primary",
  completed: "success",
  cancelled: "neutral",
  no_show: "danger",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked in" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No-show" },
];

const PAYMENT_OPTIONS = [
  { value: "all", label: "All payments" },
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export default function AppointmentsPage() {
  return (
    <Suspense fallback={null}>
      <AppointmentsPageInner />
    </Suspense>
  );
}

function AppointmentsPageInner() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const canManage = hasPermission(activeMembership?.permissions || [], PERMISSIONS.BOOKINGS_MANAGE);

  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [businessMemberId, setBusinessMemberId] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<BookingRow | null>(null);

  const members = useMembers(studioId);

  const filters: BookingFilters = {
    search: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
    businessMemberId: businessMemberId === "all" ? undefined : businessMemberId,
    page,
    limit: 20,
  };

  const { data, isLoading, isError, refetch } = useBookings(studioId, filters);

  const columns: DataTableColumn<BookingRow>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (b) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={b.customer_name} src={b.customer_image} size="sm" />
          <div className="min-w-0">
            <div className="font-medium text-on-surface truncate">{b.customer_name}</div>
            <div className="text-xs text-muted">{b.confirmation_code}</div>
          </div>
        </div>
      ),
    },
    {
      key: "when",
      header: "Date & time",
      render: (b) => (
        <div>
          <div>{new Date(b.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
          <div className="text-xs text-muted">{b.start_time.slice(0, 5)}</div>
        </div>
      ),
    },
    { key: "professional", header: "Professional", render: (b) => b.member_name },
    { key: "amount", header: "Amount", align: "right", render: (b) => formatINR(b.total_amount) },
    {
      key: "payment",
      header: "Payment",
      render: (b) => <Badge tone={b.payment_status === "paid" ? "success" : "neutral"}>{b.payment_status}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (b) => <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ")}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader title="Appointments" description="Every booking across your business, filterable and searchable." />

      <Card padding="sm" className="mb-4">
        <div className="flex flex-wrap gap-3">
          <Input
            className="w-full sm:w-64"
            placeholder="Search name, phone, code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leadingIcon={<Search size={16} />}
            aria-label="Search appointments"
          />
          <Select
            className="w-44"
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
          />
          <Select
            className="w-44"
            value={paymentStatus}
            onValueChange={(v) => {
              setPaymentStatus(v);
              setPage(1);
            }}
            options={PAYMENT_OPTIONS}
          />
          <Select
            className="w-52"
            value={businessMemberId}
            onValueChange={(v) => {
              setBusinessMemberId(v);
              setPage(1);
            }}
            options={[{ value: "all", label: "All professionals" }, ...(members.data || []).map((m) => ({ value: m.id, label: m.name }))]}
          />
        </div>
      </Card>

      {isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load appointments." />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.bookings || []}
            rowKey={(b) => b.id}
            loading={isLoading}
            onRowClick={(b) => setSelected(b)}
            emptyTitle="No appointments found"
            emptyDescription="Try adjusting your filters, or check back once bookings start coming in."
          />
          {data?.pagination ? (
            <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} className="mt-4" />
          ) : null}
        </>
      )}

      <BookingDetailDrawer
        studioId={studioId}
        booking={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        canManage={canManage}
      />
    </div>
  );
}
