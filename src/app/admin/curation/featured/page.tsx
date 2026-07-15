"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Crown } from "lucide-react";
import { Button, Input, Card, Modal } from "@/components/ui";
import { BusinessSearchPicker, type BusinessOption } from "@/components/admin/BusinessSearchPicker";
import { curationApi } from "@/lib/admin/curationApi";

const toDateInputValue = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
const fromDateInputValue = (v: string) => (v ? new Date(`${v}T00:00:00`).toISOString() : null);

interface FeaturedListEntry extends BusinessOption {
  priority: number;
  startAt: string | null;
  endAt: string | null;
  region: string | null;
  reason: string | null;
}

export default function FeaturedManagerPage() {
  // No dedicated "list all featured businesses" endpoint exists yet - the
  // admin business list already supports search, and Featured is a per-
  // business toggle, not its own collection - so this page works the same
  // way as the picker everywhere else: search, then act on what you find.
  // Businesses just set as featured in this session stay visible here so the
  // admin can see/edit what they just did without re-searching.
  const [recent, setRecent] = useState<FeaturedListEntry[]>([]);
  const [editing, setEditing] = useState<BusinessOption | null>(null);
  const [form, setForm] = useState({
    isFeatured: true,
    priority: 5,
    startAt: null as string | null,
    endAt: null as string | null,
    region: "",
    reason: "",
  });
  const [saving, setSaving] = useState(false);

  const openFor = (business: BusinessOption) => {
    setEditing(business);
    const existing = recent.find((r) => r.id === business.id);
    setForm({
      isFeatured: true,
      priority: existing?.priority ?? 5,
      startAt: existing?.startAt ?? null,
      endAt: existing?.endAt ?? null,
      region: existing?.region ?? "",
      reason: existing?.reason ?? "",
    });
  };

  const handleSave = async (isFeatured: boolean) => {
    if (!editing) return;
    setSaving(true);
    try {
      await curationApi.setFeatured(editing.id, {
        isFeatured,
        priority: form.priority,
        startAt: form.startAt,
        endAt: form.endAt,
        region: form.region.trim() || null,
        reason: form.reason.trim() || null,
      });
      toast.success(isFeatured ? `${editing.name} is now featured` : `${editing.name} unfeatured`);
      setRecent((prev) => [
        { ...editing, priority: form.priority, startAt: form.startAt, endAt: form.endAt, region: form.region || null, reason: form.reason || null },
        ...prev.filter((r) => r.id !== editing.id),
      ]);
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Featured Businesses</h1>
      <p className="text-sm text-muted mb-6">
        Give a business a small ranking boost (capped so it can never outrank genuinely more relevant results) and a
        &quot;Featured&quot; badge.
      </p>

      <Card className="mb-6 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Search &amp; feature a business</h3>
        <BusinessSearchPicker onSelect={openFor} placeholder="Search businesses to feature…" />
      </Card>

      {recent.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">Recently updated this session</h3>
          {recent.map((r) => (
            <Card key={r.id} padding="sm" className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 truncate text-sm font-medium text-on-surface">
                  <Crown size={14} className="text-primary" /> {r.name}
                </div>
                <div className="text-xs text-muted">
                  Priority {r.priority} · {r.region || "All regions"}
                  {r.endAt ? ` · until ${new Date(r.endAt).toLocaleDateString()}` : ""}
                </div>
              </div>
              <Button size="sm" intent="outline" onClick={() => openFor(r)}>
                Edit
              </Button>
            </Card>
          ))}
        </div>
      ) : null}

      <Modal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing ? `Feature ${editing.name}` : "Feature business"}
        footer={
          <>
            <Button intent="ghost" onClick={() => handleSave(false)} loading={saving}>
              Unfeature
            </Button>
            <Button onClick={() => handleSave(true)} loading={saving}>
              <Sparkles size={14} /> Feature
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Priority"
            type="number"
            min={0}
            max={8}
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
            hint="0-8. Higher = bigger ranking nudge, capped so it never overrides genuine relevance."
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start date"
              type="date"
              value={toDateInputValue(form.startAt)}
              onChange={(e) => setForm((f) => ({ ...f, startAt: fromDateInputValue(e.target.value) }))}
              hint="Optional — immediate if blank"
            />
            <Input
              label="End date"
              type="date"
              value={toDateInputValue(form.endAt)}
              onChange={(e) => setForm((f) => ({ ...f, endAt: fromDateInputValue(e.target.value) }))}
              hint="Optional — indefinite if blank"
            />
          </div>
          <Input
            label="Region"
            placeholder="e.g. Jammu — leave blank for everywhere"
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            hint="Matches the business's own city or state"
          />
          <Input
            label="Internal reason"
            placeholder="e.g. Q3 partner campaign"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            hint="Never shown to customers"
          />
        </div>
      </Modal>
    </div>
  );
}
