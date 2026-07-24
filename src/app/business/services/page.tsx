"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Plus, Search, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";
import { useBusinessAuth } from "@/lib/business/auth";
import { businessApi } from "@/lib/business/api";
import { useServices, useServiceCategories, useCreateService, useUpdateService, useDeactivateService } from "@/lib/business/hooks/useServices";
import { hasPermission, PERMISSIONS } from "@/lib/business/permissions";
import { useDebouncedValue } from "@/lib/business/useDebouncedValue";
import type { ServiceRow } from "@/lib/business/types";
import { formatINR } from "@/lib/format";

type SortKey = "name" | "price" | "duration";

export default function ServicesPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const canManage = hasPermission(activeMembership?.permissions || [], PERMISSIONS.SERVICES_MANAGE);

  const { data: services, isLoading, isError, refetch } = useServices(studioId, false);
  const categories = useServiceCategories();
  const deactivate = useDeactivateService(studioId);
  const updateService = useUpdateService(studioId);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [editing, setEditing] = useState<ServiceRow | "new" | null>(null);

  const categoryName = (id: string) => categories.data?.find((c) => c.id === id)?.name || "—";

  const visible = useMemo(() => {
    let list = services || [];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortKey === "price") return a.price - b.price;
      if (sortKey === "duration") return a.duration - b.duration;
      return a.name.localeCompare(b.name);
    });
  }, [services, debouncedSearch, sortKey]);

  const columns: DataTableColumn<ServiceRow>[] = [
    {
      key: "name",
      header: "Service",
      render: (s) => (
        <div className="flex items-center gap-3">
          {s.image_url ? (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-container-low">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image_url} alt="" className="h-full w-full object-cover" />
            </div>
          ) : null}
          <div className="min-w-0">
            <div className="font-medium text-on-surface">{s.name}</div>
            <div className="text-xs text-muted">{s.custom_category || categoryName(s.category_id)}</div>
          </div>
        </div>
      ),
    },
    { key: "duration", header: "Duration", render: (s) => `${s.duration} min` },
    { key: "price", header: "Price", align: "right", render: (s) => formatINR(s.price) },
    {
      key: "visible",
      header: "Visible",
      render: (s) =>
        canManage ? (
          <Switch
            checked={s.is_active}
            onCheckedChange={(checked) => {
              if (!checked) {
                deactivate.mutate(s.id, { onSuccess: () => toast.success("Service hidden") });
              } else {
                updateService.mutate({ serviceId: s.id, isActive: true }, { onSuccess: () => toast.success("Service visible") });
              }
            }}
          />
        ) : (
          <Badge tone={s.is_active ? "success" : "neutral"}>{s.is_active ? "Visible" : "Hidden"}</Badge>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Services"
        description="What customers can book, and what it costs."
        actions={
          canManage ? (
            <Button onClick={() => setEditing("new")}>
              <Plus size={16} /> Add service
            </Button>
          ) : undefined
        }
      />

      <Card padding="sm" className="mb-4">
        <div className="flex flex-wrap gap-3">
          <Input
            className="w-full sm:w-64"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leadingIcon={<Search size={16} />}
          />
          <Select
            className="w-44"
            value={sortKey}
            onValueChange={(v) => setSortKey(v as SortKey)}
            options={[
              { value: "name", label: "Sort: Name" },
              { value: "price", label: "Sort: Price" },
              { value: "duration", label: "Sort: Duration" },
            ]}
          />
        </div>
      </Card>

      {isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load services." />
      ) : (
        <DataTable
          columns={columns}
          data={visible}
          rowKey={(s) => s.id}
          loading={isLoading}
          onRowClick={canManage ? (s) => setEditing(s) : undefined}
          emptyTitle="No services yet"
          emptyDescription="Add your first service so customers can start booking."
        />
      )}

      {editing ? (
        <ServiceFormModal
          studioId={studioId}
          service={editing === "new" ? null : editing}
          categories={categories.data || []}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}

function ServiceFormModal({
  studioId,
  service,
  categories,
  onClose,
}: {
  studioId: string | undefined;
  service: ServiceRow | null;
  categories: { id: string; name: string; slug?: string }[];
  onClose: () => void;
}) {
  const createService = useCreateService(studioId);
  const updateService = useUpdateService(studioId);
  const [form, setForm] = useState({
    name: service?.name || "",
    categoryId: service?.category_id || categories[0]?.id || "",
    customCategory: service?.custom_category || "",
    price: service?.price || 0,
    duration: service?.duration || 30,
    description: service?.description || "",
    imageUrl: service?.image_url || "",
  });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // The catch-all "Other" category unlocks a free-text label so the owner can
  // say what their service actually is.
  const isOtherCategory = categories.find((c) => c.id === form.categoryId)?.slug === "other";

  // Upload the chosen photo to R2 immediately (the service row may not exist yet
  // on the Add form), then hold the returned URL to send as imageUrl on save.
  const handleImageFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const { url } = await businessApi.uploadServiceImage(studioId as string, data);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't upload photo");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.categoryId) {
      toast.error("Name and category are required");
      return;
    }
    if (isOtherCategory && !form.customCategory.trim()) {
      toast.error("Please type the category for this service");
      return;
    }
    const payload = {
      name: form.name,
      categoryId: form.categoryId,
      customCategory: isOtherCategory ? form.customCategory.trim() : undefined,
      price: form.price,
      duration: form.duration,
      description: form.description || undefined,
      // url to set/keep the photo; null to clear it when editing; undefined to
      // leave it unset on a brand-new service.
      imageUrl: form.imageUrl || (service ? null : undefined),
    };

    if (service) {
      updateService.mutate(
        { serviceId: service.id, ...payload },
        { onSuccess: () => { toast.success("Service updated"); onClose(); }, onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update") }
      );
    } else {
      createService.mutate(payload, {
        onSuccess: () => { toast.success("Service created"); onClose(); },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't create service"),
      });
    }
  };

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={service ? "Edit service" : "Add service"}
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={createService.isPending || updateService.isPending}>
            {service ? "Save changes" : "Create service"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Select
          label="Category"
          value={form.categoryId}
          onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        {isOtherCategory && (
          <Input
            label="Custom category"
            value={form.customCategory}
            maxLength={100}
            placeholder="e.g. Piercing, Tattoo, Makeup"
            hint="Shown to customers in place of “Other”."
            onChange={(e) => setForm((f) => ({ ...f, customCategory: e.target.value }))}
          />
        )}
        <Textarea
          label="Description"
          value={form.description}
          maxLength={2000}
          rows={3}
          placeholder="Explain what's included, what to expect, or anything customers should know."
          hint="Optional — a short explanation customers see for this service."
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">Photo</label>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImageFile(e.target.files?.[0])}
          />
          {form.imageUrl ? (
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-container-low">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col items-start gap-1.5">
                <Button type="button" intent="outline" size="sm" onClick={() => imageInputRef.current?.click()} loading={uploadingImage}>
                  <ImagePlus size={16} /> Replace
                </Button>
                <Button type="button" intent="ghost" size="sm" onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}>
                  <X size={16} /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <Button type="button" intent="outline" size="sm" className="self-start" onClick={() => imageInputRef.current?.click()} loading={uploadingImage}>
              <ImagePlus size={16} /> Add photo
            </Button>
          )}
          <p className="text-xs text-muted">Optional — one photo customers see for this service.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price (₹)"
            type="number"
            min={0}
            placeholder="0"
            // `|| ""` so a 0 shows as an empty field the owner can clear and
            // retype — binding the raw number kept snapping it back to "0".
            value={form.price || ""}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
          />
          <Input
            label="Duration (min)"
            type="number"
            min={5}
            placeholder="30"
            value={form.duration || ""}
            onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))}
          />
        </div>
      </div>
    </Modal>
  );
}
