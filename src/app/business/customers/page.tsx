"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Avatar } from "@/components/ui/Avatar";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBusinessAuth } from "@/lib/business/auth";
import { useCustomers, useCustomerBookingHistory } from "@/lib/business/hooks/useCustomers";
import { useDebouncedValue } from "@/lib/business/useDebouncedValue";
import type { CustomerRow } from "@/lib/business/types";
import { formatINR } from "@/lib/format";

const STATUS_TONE: Record<string, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "primary",
  completed: "success",
  cancelled: "neutral",
  no_show: "danger",
};

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <CustomersPageInner />
    </Suspense>
  );
}

function CustomersPageInner() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CustomerRow | null>(null);

  const { data, isLoading, isError, refetch } = useCustomers(studioId, { search: debouncedSearch || undefined, page, limit: 20 });

  const columns: DataTableColumn<CustomerRow>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={c.name} src={c.imageUrl} size="sm" />
          <div className="min-w-0">
            <div className="font-medium text-on-surface truncate">{c.name}</div>
            {c.phone ? <div className="text-xs text-muted">{c.phone}</div> : null}
          </div>
        </div>
      ),
    },
    { key: "visits", header: "Visits", align: "right", render: (c) => c.visitsCount },
    { key: "spent", header: "Total spent", align: "right", render: (c) => formatINR(c.totalSpent) },
    { key: "first", header: "First visit", render: (c) => new Date(c.firstVisit).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
    { key: "last", header: "Last visit", render: (c) => new Date(c.lastVisit).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
  ];

  return (
    <div>
      <PageHeader title="Customers" description="Everyone who has booked with your business." />

      <Card padding="sm" className="mb-4">
        <Input
          className="w-full sm:w-80"
          placeholder="Search name or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          leadingIcon={<Search size={16} />}
          aria-label="Search customers"
        />
      </Card>

      {isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load customers." />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.customers || []}
            rowKey={(c) => c.id}
            loading={isLoading}
            onRowClick={(c) => setSelected(c)}
            emptyTitle="No customers yet"
            emptyDescription="Customers appear here automatically once they book an appointment."
          />
          {data?.pagination ? (
            <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} className="mt-4" />
          ) : null}
        </>
      )}

      <CustomerHistoryDrawer studioId={studioId} customer={selected} open={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}

function CustomerHistoryDrawer({
  studioId,
  customer,
  open,
  onOpenChange,
}: {
  studioId: string | undefined;
  customer: CustomerRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const history = useCustomerBookingHistory(studioId, customer?.id, { limit: 50 });

  if (!customer) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={customer.name} description={customer.phone || undefined}>
      <div className="grid grid-cols-2 gap-3 text-sm mb-5">
        <div>
          <div className="text-xs text-muted">Lifetime visits</div>
          <div className="font-semibold text-on-surface">{customer.visitsCount}</div>
        </div>
        <div>
          <div className="text-xs text-muted">Total spent</div>
          <div className="font-semibold text-on-surface">{formatINR(customer.totalSpent)}</div>
        </div>
      </div>

      <div className="text-sm font-semibold text-on-surface mb-3">Booking history</div>
      {history.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : history.data && history.data.bookings.length > 0 ? (
        <div className="flex flex-col divide-y divide-border">
          {history.data.bookings.map((b) => (
            <div key={b.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-on-surface">
                  {new Date(b.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <div className="text-xs text-muted">
                  {b.start_time.slice(0, 5)} · with {b.member_name} · {formatINR(b.total_amount)}
                </div>
              </div>
              <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ")}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No history" description="No bookings found for this customer." />
      )}
    </Drawer>
  );
}
