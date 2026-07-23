"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KanbanSquare, Rows3, Search, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
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
import { useDebouncedValue } from "@/lib/business/useDebouncedValue";
import { hasPermission, PERMISSIONS } from "@/lib/business/permissions";
import { BookingDetailDrawer } from "@/components/business/BookingDetailDrawer";
import { AppointmentsBoard } from "@/components/business/AppointmentsBoard";
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

export default function StaffAppointmentsPage() {
  return (
    <Suspense fallback={null}>
      <StaffAppointmentsPageInner />
    </Suspense>
  );
}

function StaffAppointmentsPageInner() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const memberId = activeMembership?.memberId;
  const canManage = hasPermission(activeMembership?.permissions || [], PERMISSIONS.BOOKINGS_MANAGE);

  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [view, setView] = useState<"table" | "board">("table");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<BookingRow | null>(null);

  const isBoard = view === "board";

  const filters: BookingFilters = {
    search: debouncedSearch || undefined,
    businessMemberId: memberId,
    status: isBoard || status === "all" ? undefined : status,
    paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
    from: from || undefined,
    to: to || undefined,
    page: isBoard ? 1 : page,
    limit: isBoard ? 100 : 20,
  };

  const hasFilters = !!search || status !== "all" || paymentStatus !== "all" || !!from || !!to;

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setPaymentStatus("all");
    setFrom("");
    setTo("");
    setPage(1);
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
      <PageHeader
        title="My Appointments"
        description="Your bookings, filterable and searchable."
        actions={
          <div className="flex items-center gap-1 rounded-xl border border-border p-1">
            <Button
              intent={view === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("table")}
              aria-pressed={view === "table"}
            >
              <Rows3 size={16} /> Table
            </Button>
            <Button
              intent={isBoard ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("board")}
              aria-pressed={isBoard}
            >
              <KanbanSquare size={16} /> Board
            </Button>
          </div>
        }
      />

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
          {!isBoard ? (
            <Select
              className="w-44"
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={STATUS_OPTIONS}
            />
          ) : null}
          <Select
            className="w-44"
            value={paymentStatus}
            onValueChange={(v) => {
              setPaymentStatus(v);
              setPage(1);
            }}
            options={PAYMENT_OPTIONS}
          />
          <Input
            type="date"
            className="w-40"
            value={from}
            onChange={(e) => { setFrom(e.target.value); setPage(1); }}
            aria-label="From date"
          />
          <Input
            type="date"
            className="w-40"
            value={to}
            onChange={(e) => { setTo(e.target.value); setPage(1); }}
            aria-label="To date"
          />
          {hasFilters ? (
            <Button intent="ghost" size="sm" onClick={resetFilters}>
              <X size={16} /> Clear
            </Button>
          ) : null}
        </div>
      </Card>

      {isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load appointments." />
      ) : isBoard ? (
        <AppointmentsBoard
          studioId={studioId}
          bookings={data?.bookings || []}
          loading={isLoading}
          canManage={canManage}
          onSelect={setSelected}
        />
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
