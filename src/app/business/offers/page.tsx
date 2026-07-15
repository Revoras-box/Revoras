"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ErrorState } from "@/components/ui/ErrorState";
import { useBusinessAuth } from "@/lib/business/auth";
import { useOffers, useCreateOffer, useUpdateOffer, useDeleteOffer } from "@/lib/business/hooks/useOffers";
import { useServices } from "@/lib/business/hooks/useServices";
import { hasPermission, PERMISSIONS, PermissionGate } from "@/lib/business/permissions";
import type { OfferRow, OfferStatus } from "@/lib/business/types";
import { formatINR } from "@/lib/format";

const STATUS_TONE: Record<OfferStatus, "success" | "primary" | "neutral" | "warning"> = {
  active: "success",
  scheduled: "primary",
  expired: "neutral",
  inactive: "warning",
};

const discountLabel = (o: OfferRow) =>
  o.discountType === "percentage"
    ? `${o.discountValue}% off${o.maxDiscountAmount != null ? ` up to ${formatINR(o.maxDiscountAmount)}` : ""}`
    : `${formatINR(o.discountValue)} off`;

export default function OffersPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const canManage = hasPermission(activeMembership?.permissions || [], PERMISSIONS.OFFERS_MANAGE);

  const { data: offers, isLoading, isError, refetch } = useOffers(studioId);
  const deleteOffer = useDeleteOffer(studioId);
  const [editing, setEditing] = useState<OfferRow | "new" | null>(null);

  const sorted = useMemo(() => {
    const rank: Record<OfferStatus, number> = { active: 0, scheduled: 1, inactive: 2, expired: 3 };
    return [...(offers || [])].sort((a, b) => rank[a.status] - rank[b.status] || a.title.localeCompare(b.title));
  }, [offers]);

  const handleDelete = (o: OfferRow) => {
    if (!window.confirm(`Delete "${o.title}"? Past bookings that used it keep their discount.`)) return;
    deleteOffer.mutate(o.id, {
      onSuccess: () => toast.success("Offer deleted"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't delete offer"),
    });
  };

  const columns: DataTableColumn<OfferRow>[] = [
    {
      key: "title",
      header: "Offer",
      render: (o) => (
        <div>
          <div className="font-medium text-on-surface">{o.title}</div>
          <div className="text-xs text-muted">
            {discountLabel(o)} · {o.appliesTo === "business" ? "All services" : `${o.serviceIds.length} service${o.serviceIds.length === 1 ? "" : "s"}`}
          </div>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (o) => <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge> },
    {
      key: "window",
      header: "Runs",
      render: (o) => (
        <span className="text-xs text-muted">
          {o.startAt ? new Date(o.startAt).toLocaleDateString() : "Now"} – {o.endAt ? new Date(o.endAt).toLocaleDateString() : "No end"}
        </span>
      ),
    },
    { key: "usage", header: "Used", render: (o) => <span className="text-sm">{o.usageCount ?? 0}{o.maxUses != null ? ` / ${o.maxUses}` : ""}</span> },
    ...(canManage
      ? [
          {
            key: "actions",
            header: "",
            render: (o: OfferRow) => (
              <Button intent="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(o); }}>
                Delete
              </Button>
            ),
          } as DataTableColumn<OfferRow>,
        ]
      : []),
  ];

  return (
    <PermissionGate permissions={activeMembership?.permissions || []} require={PERMISSIONS.OFFERS_MANAGE}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Offers"
          description="Run discounts to attract and reward customers. The best applicable offer is applied automatically at booking."
          actions={
            canManage ? (
              <Button onClick={() => setEditing("new")}>
                <Plus size={16} /> New offer
              </Button>
            ) : undefined
          }
        />

        {isError ? (
          <ErrorState onRetry={() => refetch()} description="Couldn't load offers." />
        ) : (
          <DataTable
            columns={columns}
            data={sorted}
            rowKey={(o) => o.id}
            loading={isLoading}
            onRowClick={canManage ? (o) => setEditing(o) : undefined}
            emptyTitle="No offers yet"
            emptyDescription="Create your first offer to start attracting bookings."
          />
        )}

        {editing ? (
          <OfferFormModal studioId={studioId} offer={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
        ) : null}
      </div>
    </PermissionGate>
  );
}

const toDateInput = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

function OfferFormModal({ studioId, offer, onClose }: { studioId: string | undefined; offer: OfferRow | null; onClose: () => void }) {
  const createOffer = useCreateOffer(studioId);
  const updateOffer = useUpdateOffer(studioId);
  const { data: services } = useServices(studioId, true);

  const [form, setForm] = useState({
    title: offer?.title || "",
    description: offer?.description || "",
    discountType: offer?.discountType || ("percentage" as "flat" | "percentage"),
    discountValue: offer?.discountValue ?? 10,
    maxDiscountAmount: offer?.maxDiscountAmount ?? ("" as number | ""),
    minSpend: offer?.minSpend ?? ("" as number | ""),
    appliesTo: offer?.appliesTo || ("business" as "business" | "services"),
    serviceIds: offer?.serviceIds || ([] as string[]),
    startAt: toDateInput(offer?.startAt ?? null),
    endAt: toDateInput(offer?.endAt ?? null),
    isActive: offer?.isActive ?? true,
    maxUses: offer?.maxUses ?? ("" as number | ""),
    maxUsesPerUser: offer?.maxUsesPerUser ?? ("" as number | ""),
    firstTimeOnly: offer?.firstTimeOnly ?? false,
  });

  // Effective-price preview: what a customer paying `sampleSpend` would pay.
  const [sampleSpend, setSampleSpend] = useState(1000);
  const preview = useMemo(() => {
    const value = Number(form.discountValue) || 0;
    let discount = form.discountType === "percentage" ? (sampleSpend * value) / 100 : value;
    if (form.discountType === "percentage" && form.maxDiscountAmount !== "") {
      discount = Math.min(discount, Number(form.maxDiscountAmount));
    }
    discount = Math.min(discount, sampleSpend);
    if (form.minSpend !== "" && sampleSpend < Number(form.minSpend)) discount = 0;
    return { discount: Math.max(0, discount), total: sampleSpend - Math.max(0, discount) };
  }, [form.discountType, form.discountValue, form.maxDiscountAmount, form.minSpend, sampleSpend]);

  const toggleService = (id: string) =>
    setForm((f) => ({ ...f, serviceIds: f.serviceIds.includes(id) ? f.serviceIds.filter((x) => x !== id) : [...f.serviceIds, id] }));

  const handleSubmit = () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (form.discountType === "percentage" && Number(form.discountValue) > 100) return toast.error("Percentage can't exceed 100%");
    if (form.appliesTo === "services" && form.serviceIds.length === 0) return toast.error("Pick at least one service");
    if (form.startAt && form.endAt && form.startAt >= form.endAt) return toast.error("End date must be after start date");

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      maxDiscountAmount: form.discountType === "percentage" && form.maxDiscountAmount !== "" ? Number(form.maxDiscountAmount) : null,
      minSpend: form.minSpend !== "" ? Number(form.minSpend) : null,
      appliesTo: form.appliesTo,
      serviceIds: form.appliesTo === "services" ? form.serviceIds : [],
      startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
      endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
      isActive: form.isActive,
      maxUses: form.maxUses !== "" ? Number(form.maxUses) : null,
      maxUsesPerUser: form.maxUsesPerUser !== "" ? Number(form.maxUsesPerUser) : null,
      firstTimeOnly: form.firstTimeOnly,
    };

    const opts = {
      onSuccess: () => { toast.success(offer ? "Offer updated" : "Offer created"); onClose(); },
      onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Couldn't save offer"),
    };
    if (offer) updateOffer.mutate({ offerId: offer.id, ...payload }, opts);
    else createOffer.mutate(payload, opts);
  };

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={offer ? "Edit offer" : "New offer"}
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={createOffer.isPending || updateOffer.isPending}>
            {offer ? "Save changes" : "Create offer"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Monsoon Special" />
        <Input label="Description (optional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Discount type"
            value={form.discountType}
            onValueChange={(v) => setForm((f) => ({ ...f, discountType: v as "flat" | "percentage" }))}
            options={[{ value: "percentage", label: "Percentage (%)" }, { value: "flat", label: "Flat (₹)" }]}
          />
          <Input
            label={form.discountType === "percentage" ? "Percent off" : "Rupees off"}
            type="number"
            min={0}
            value={form.discountValue}
            onChange={(e) => setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))}
          />
        </div>

        {form.discountType === "percentage" ? (
          <Input
            label="Max discount cap (₹, optional)"
            type="number"
            min={0}
            value={form.maxDiscountAmount}
            onChange={(e) => setForm((f) => ({ ...f, maxDiscountAmount: e.target.value === "" ? "" : Number(e.target.value) }))}
          />
        ) : null}

        <Input
          label="Minimum spend (₹, optional)"
          type="number"
          min={0}
          value={form.minSpend}
          onChange={(e) => setForm((f) => ({ ...f, minSpend: e.target.value === "" ? "" : Number(e.target.value) }))}
        />

        <Select
          label="Applies to"
          value={form.appliesTo}
          onValueChange={(v) => setForm((f) => ({ ...f, appliesTo: v as "business" | "services" }))}
          options={[{ value: "business", label: "All services" }, { value: "services", label: "Specific services" }]}
        />

        {form.appliesTo === "services" ? (
          <div className="flex flex-col gap-2 rounded-lg border border-border p-3 max-h-48 overflow-y-auto">
            {(services || []).length === 0 ? (
              <p className="text-sm text-muted">No active services to target.</p>
            ) : (
              (services || []).map((s) => (
                <Checkbox key={s.id} label={`${s.name} (${formatINR(s.price)})`} checked={form.serviceIds.includes(s.id)} onCheckedChange={() => toggleService(s.id)} />
              ))
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <Input label="Starts (optional)" type="date" value={form.startAt} onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))} />
          <Input label="Ends (optional)" type="date" value={form.endAt} onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Total uses limit (optional)"
            type="number"
            min={1}
            value={form.maxUses}
            onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value === "" ? "" : Number(e.target.value) }))}
          />
          <Input
            label="Per-customer limit (optional)"
            type="number"
            min={1}
            value={form.maxUsesPerUser}
            onChange={(e) => setForm((f) => ({ ...f, maxUsesPerUser: e.target.value === "" ? "" : Number(e.target.value) }))}
          />
        </div>

        <Checkbox label="First-time customers only" checked={form.firstTimeOnly} onCheckedChange={(v) => setForm((f) => ({ ...f, firstTimeOnly: !!v }))} />
        <Checkbox label="Active" checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: !!v }))} />

        {/* Effective-price preview */}
        <div className="rounded-lg bg-surface-container-high p-3 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted">Preview on a</span>
            <Input
              type="number"
              min={0}
              value={sampleSpend}
              onChange={(e) => setSampleSpend(Number(e.target.value))}
              className="w-28"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Customer pays</span>
            <span className="font-semibold text-on-surface">
              <span className="mr-2 text-muted line-through">{formatINR(sampleSpend)}</span>
              {formatINR(preview.total)}
            </span>
          </div>
          <div className="mt-1 text-right text-xs text-success">They save {formatINR(preview.discount)}</div>
        </div>
      </div>
    </Modal>
  );
}
