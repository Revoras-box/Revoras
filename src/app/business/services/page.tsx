"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";
import { useBusinessAuth } from "@/lib/business/auth";
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
        <div>
          <div className="font-medium text-on-surface">{s.name}</div>
          <div className="text-xs text-muted">{categoryName(s.category_id)}</div>
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
  categories: { id: string; name: string }[];
  onClose: () => void;
}) {
  const createService = useCreateService(studioId);
  const updateService = useUpdateService(studioId);
  const [form, setForm] = useState({
    name: service?.name || "",
    categoryId: service?.category_id || categories[0]?.id || "",
    price: service?.price || 0,
    duration: service?.duration || 30,
    description: service?.description || "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.categoryId) {
      toast.error("Name and category are required");
      return;
    }
    const payload = { name: form.name, categoryId: form.categoryId, price: form.price, duration: form.duration, description: form.description || undefined };

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
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price (₹)"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
          />
          <Input
            label="Duration (min)"
            type="number"
            min={5}
            value={form.duration}
            onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))}
          />
        </div>
      </div>
    </Modal>
  );
}
