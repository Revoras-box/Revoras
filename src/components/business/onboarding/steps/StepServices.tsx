"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Clock, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useServices,
  useServiceCategories,
  useCreateService,
  useDeactivateService,
} from "@/lib/business/hooks/useServices";
import { formatINR } from "@/lib/format";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

export function StepServices({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: services, isLoading } = useServices(studioId, false);
  const { data: categories } = useServiceCategories();
  const deactivate = useDeactivateService(studioId);
  const [adding, setAdding] = useState(false);

  const active = (services || []).filter((s) => s.is_active);
  const hasService = active.length > 0;

  return (
    <div>
      <StepHeader
        eyebrow="Step 4 of 10"
        title="Services"
        description="What can customers book, and what does it cost? Add at least one service to continue."
      />

      <div className="max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">{active.length} service{active.length === 1 ? "" : "s"}</p>
          <Button intent="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus size={16} /> Add service
          </Button>
        </div>

        {isLoading ? (
          <Skeleton className="h-40 rounded-2xl" />
        ) : active.length === 0 ? (
          <Card>
            <EmptyState
              title="No services yet"
              description="Add your first service so customers can start booking."
              action={
                <Button onClick={() => setAdding(true)}>
                  <Plus size={16} /> Add your first service
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {active.map((s) => (
              <Card key={s.id} padding="sm" className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium text-on-surface">{s.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {s.duration} min
                    </span>
                    <span>·</span>
                    <span>{formatINR(s.price)}</span>
                  </div>
                </div>
                <button
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-container-low hover:text-error"
                  aria-label={`Remove ${s.name}`}
                  onClick={() => deactivate.mutate(s.id, { onSuccess: () => toast.success("Service removed") })}
                >
                  <Trash2 size={16} />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {adding ? (
        <AddServiceModal studioId={studioId} categories={categories || []} onClose={() => setAdding(false)} />
      ) : null}

      <WizardFooter
        onPrev={goPrev}
        onNext={() => goNext()}
        onExit={exit}
        nextDisabled={!hasService}
        nextLoading={saving}
        hint={!hasService ? "Add at least one service to continue." : undefined}
      />
    </div>
  );
}

function AddServiceModal({
  studioId,
  categories,
  onClose,
}: {
  studioId: string;
  categories: { id: string; name: string }[];
  onClose: () => void;
}) {
  const createService = useCreateService(studioId);
  const [form, setForm] = useState({ name: "", categoryId: categories[0]?.id || "", price: 0, duration: 30 });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.categoryId) {
      toast.error("Name and category are required");
      return;
    }
    createService.mutate(
      { name: form.name.trim(), categoryId: form.categoryId, price: form.price, duration: form.duration },
      {
        onSuccess: () => {
          toast.success("Service added");
          onClose();
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't add service"),
      }
    );
  };

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title="Add service"
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={createService.isPending}>
            Add service
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input label="Name" placeholder="e.g. Haircut & styling" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Select
          label="Category"
          placeholder="Choose a category"
          value={form.categoryId}
          onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Price (₹)" type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
          <Input label="Duration (min)" type="number" min={5} value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))} />
        </div>
      </div>
    </Modal>
  );
}
