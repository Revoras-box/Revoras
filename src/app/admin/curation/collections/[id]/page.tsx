"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Copy, Eye, GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  Card,
  Badge,
  Spinner,
  Divider,
  EmptyState,
  BusinessCard,
} from "@/components/ui";
import { useCategories } from "@/lib/hooks";
import { businessToCardProps } from "@/components/user/sections/utils";
import { BusinessSearchPicker, type BusinessOption } from "@/components/admin/BusinessSearchPicker";
import { curationApi, type AdminCollectionDetail, type CollectionFormInput } from "@/lib/admin/curationApi";
import type { Business } from "@/lib/types";

const toDateInputValue = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
const fromDateInputValue = (v: string) => (v ? new Date(`${v}T00:00:00`).toISOString() : null);

// Pinned businesses need their own card data (name/city) to render in the
// reorder list, separate from the live-preview pool below - fetched once via
// the same admin business search endpoint the picker uses.
interface PinnedRow {
  id: string;
  name: string;
  city: string | null;
}

export default function CollectionEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [collection, setCollection] = useState<AdminCollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CollectionFormInput>({});
  const [pinnedRows, setPinnedRows] = useState<PinnedRow[]>([]);
  const [preview, setPreview] = useState<{ businesses: (Business & { pinned?: boolean })[]; pagination: { total: number } } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const { data: categoriesData } = useCategories("business");
  const categoryOptions = [
    { value: "", label: "Any category" },
    ...(categoriesData?.categories ?? []).map((c) => ({ value: c.id, label: c.name })),
  ];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await curationApi.getCollection(id);
      setCollection(res.collection);
      setForm(res.collection);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't load collection");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const res = await curationApi.previewCollection(id, { limit: 12 });
      setPreview(res);
      // Pinned rows for the reorder list come straight from the preview
      // response (it already resolves full business card data), no second fetch.
      setPinnedRows(
        res.businesses.filter((b) => b.pinned).map((b) => ({ id: b.id, name: b.name, city: b.city }))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't load preview");
    } finally {
      setPreviewLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    loadPreview();
  }, [load, loadPreview]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await curationApi.updateCollection(id, form);
      toast.success("Saved");
      load();
      loadPreview();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save");
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const res = await curationApi.duplicateCollection(id);
      toast.success("Duplicated — the copy starts inactive for review");
      router.push(`/admin/curation/collections/${res.collection.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't duplicate");
    }
  };

  const handlePin = async (business: BusinessOption) => {
    try {
      await curationApi.pinBusiness(id, business.id);
      toast.success(`Pinned ${business.name}`);
      loadPreview();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't pin business");
    }
  };

  const handleUnpin = async (businessId: string) => {
    try {
      await curationApi.unpinBusiness(id, businessId);
      toast.success("Removed");
      loadPreview();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove");
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const next = [...pinnedRows];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setPinnedRows(next);
    try {
      await curationApi.reorderItems(id, next.map((r) => r.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't reorder");
      loadPreview();
    }
  };

  if (loading || !collection) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const field = <K extends keyof CollectionFormInput>(key: K) => ({
    value: (form[key] as string | number | undefined) ?? "",
    onChange: (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="max-w-5xl">
      <button
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        onClick={() => router.push("/admin/curation/collections")}
      >
        <ArrowLeft size={14} /> Collections
      </button>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{collection.title}</h1>
          <p className="text-sm text-muted">/{collection.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={collection.isActive ? "success" : "neutral"}>{collection.isActive ? "Active" : "Inactive"}</Badge>
          <Button intent="outline" size="sm" onClick={handleDuplicate}>
            <Copy size={14} /> Duplicate
          </Button>
          <Button size="sm" onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Details + filters */}
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Details</h3>
            <Input label="Title" {...field("title")} />
            <Input label="Subtitle" placeholder="e.g. Hand-picked by our team" {...field("subtitle")} />
            <Input label="Slug" {...field("slug")} hint="Used in the collection's URL" />
            <Input label="Cover image URL" {...field("coverImageUrl")} />
            <Textarea label="Description" {...field("description")} />
            <Input label="Display order" type="number" {...field("displayOrder")} />
            <Switch
              label="Active"
              description="Inactive collections are never shown to customers, regardless of schedule."
              checked={form.isActive ?? false}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            />
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Scheduling &amp; targeting</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start date"
                type="date"
                value={toDateInputValue(form.startAt ?? null)}
                onChange={(e) => setForm((f) => ({ ...f, startAt: fromDateInputValue(e.target.value) }))}
                hint="Optional"
              />
              <Input
                label="End date"
                type="date"
                value={toDateInputValue(form.endAt ?? null)}
                onChange={(e) => setForm((f) => ({ ...f, endAt: fromDateInputValue(e.target.value) }))}
                hint="Optional"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Target city" placeholder="e.g. Jammu" {...field("targetCity")} />
              <Input label="Target state" placeholder="Optional" {...field("targetState")} />
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Auto-fill filter criteria</h3>
            <p className="-mt-2 text-xs text-muted">
              Businesses matching these criteria fill any remaining slots after your pinned picks, ranked the same way as
              the main discovery feed.
            </p>
            <Select
              label="Category"
              options={categoryOptions}
              value={form.filterCategoryId ?? ""}
              onValueChange={(v) => setForm((f) => ({ ...f, filterCategoryId: v || null }))}
            />
            <Input
              label="Minimum rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={form.filterMinRating ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, filterMinRating: e.target.value ? Number(e.target.value) : null }))}
            />
            <Switch
              label="Verified only"
              checked={form.filterVerifiedOnly ?? false}
              onCheckedChange={(v) => setForm((f) => ({ ...f, filterVerifiedOnly: v }))}
            />
            <Switch
              label="Premium only"
              checked={form.filterPremiumOnly ?? false}
              onCheckedChange={(v) => setForm((f) => ({ ...f, filterPremiumOnly: v }))}
            />
          </Card>
        </div>

        {/* Pinned businesses + live preview */}
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Pinned businesses</h3>
            <p className="-mt-2 text-xs text-muted">Always shown first, in this order, regardless of the filter criteria above.</p>
            <BusinessSearchPicker onSelect={handlePin} excludeIds={pinnedRows.map((r) => r.id)} />
            {pinnedRows.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {pinnedRows.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                    <GripVertical size={14} className="text-muted" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-on-surface">{r.name}</div>
                      <div className="text-xs text-muted">{r.city || "—"}</div>
                    </div>
                    <button
                      className="rounded p-1 text-muted hover:bg-surface-container-low disabled:opacity-30"
                      disabled={i === 0}
                      aria-label="Move up"
                      onClick={() => move(i, -1)}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      className="rounded p-1 text-muted hover:bg-surface-container-low disabled:opacity-30"
                      disabled={i === pinnedRows.length - 1}
                      aria-label="Move down"
                      onClick={() => move(i, 1)}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      className="rounded p-1 text-muted hover:bg-surface-container-low hover:text-error"
                      aria-label={`Remove ${r.name}`}
                      onClick={() => handleUnpin(r.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No businesses pinned yet — search above to add some.</p>
            )}
          </Card>

          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Eye size={14} /> Live preview
              </h3>
              {preview ? <span className="text-xs text-muted">{preview.pagination.total} total</span> : null}
            </div>
            {previewLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : preview && preview.businesses.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {preview.businesses.map((b) => (
                  <div key={b.id} className="relative">
                    {b.pinned ? (
                      <Badge tone="primary" className="absolute left-2 top-2 z-10">
                        Pinned
                      </Badge>
                    ) : null}
                    <BusinessCard {...businessToCardProps(b)} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Nothing matches yet" description="Pin a business or loosen the filter criteria." className="py-8" />
            )}
          </Card>
        </div>
      </div>

      <Divider className="my-8" />
    </div>
  );
}
