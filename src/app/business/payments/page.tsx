"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Wallet, TrendingUp, RotateCcw, Hash } from "lucide-react";
import { useBusinessAuth } from "@/lib/business/auth";
import { usePayments, type PaymentFilters } from "@/lib/business/hooks/usePayments";
import type { PaymentRow } from "@/lib/business/types";
import { formatINR } from "@/lib/format";
import { ICON_SIZE } from "@/lib/design-tokens";

const STATUS_TONE: Record<string, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  refunded: "neutral",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export default function PaymentsPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;

  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const filters: PaymentFilters = {
    status: status === "all" ? undefined : status,
    from: from || undefined,
    to: to || undefined,
    page,
    limit: 20,
  };

  const { data, isLoading, isError, refetch } = usePayments(studioId, filters);

  const columns: DataTableColumn<PaymentRow>[] = [
    {
      key: "booking",
      header: "Booking",
      render: (p) => (
        <Link href={`/business/appointments?search=${encodeURIComponent(p.confirmationCode)}`} className="text-primary hover:underline">
          {p.confirmationCode}
        </Link>
      ),
    },
    { key: "customer", header: "Customer", render: (p) => p.customerName },
    { key: "date", header: "Date", render: (p) => new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
    { key: "amount", header: "Amount", align: "right", render: (p) => formatINR(p.amount) },
    { key: "status", header: "Status", render: (p) => <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Payments" description="Revenue and transaction history for your business." />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total paid" value={formatINR(data.summary.totalPaid)} icon={<Wallet size={ICON_SIZE.md} />} />
          <StatCard label="Pending" value={formatINR(data.summary.totalPending)} icon={<TrendingUp size={ICON_SIZE.md} />} />
          <StatCard label="Refunded" value={formatINR(data.summary.totalRefunded)} icon={<RotateCcw size={ICON_SIZE.md} />} />
          <StatCard label="Transactions" value={data.summary.totalCount} icon={<Hash size={ICON_SIZE.md} />} />
        </div>
      ) : null}

      <Card padding="sm" className="mb-4">
        <div className="flex flex-wrap gap-3">
          <Select
            className="w-44"
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
          />
          <Input type="date" className="w-44" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} aria-label="From date" />
          <Input type="date" className="w-44" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} aria-label="To date" />
        </div>
      </Card>

      {isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load payments." />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.payments || []}
            rowKey={(p) => p.id}
            loading={isLoading}
            emptyTitle="No transactions yet"
            emptyDescription="Payments will appear here once customers start paying online."
          />
          {data?.pagination ? (
            <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} className="mt-4" />
          ) : null}
        </>
      )}
    </div>
  );
}
