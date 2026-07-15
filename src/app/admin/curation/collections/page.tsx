"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Copy, Trash2 } from "lucide-react";
import {
  Button,
  Input,
  Modal,
  Badge,
  DataTable,
  type DataTableColumn,
  ConfirmDialog,
  EmptyState,
} from "@/components/ui";
import { curationApi, type AdminCollection } from "@/lib/admin/curationApi";

export default function CollectionsManagerPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCollection | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await curationApi.listCollections({ search: search || undefined, limit: 50 });
      setCollections(res.collections);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(load, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    setCreating(true);
    try {
      const res = await curationApi.createCollection({ title: newTitle.trim() });
      toast.success("Collection created");
      setCreateOpen(false);
      setNewTitle("");
      router.push(`/admin/curation/collections/${res.collection.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create collection");
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (c: AdminCollection, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await curationApi.duplicateCollection(c.id);
      toast.success("Duplicated — the copy starts inactive for review");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't duplicate");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await curationApi.deleteCollection(deleteTarget.id);
      toast.success("Collection deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<AdminCollection>[] = [
    {
      key: "title",
      header: "Collection",
      render: (c) => (
        <div>
          <div className="font-medium text-on-surface">{c.title}</div>
          <div className="text-xs text-muted">/{c.slug}</div>
        </div>
      ),
    },
    { key: "targeting", header: "Targeting", render: (c) => [c.targetCity, c.targetState].filter(Boolean).join(", ") || "Everywhere" },
    {
      key: "window",
      header: "Publish window",
      render: (c) =>
        c.startAt || c.endAt
          ? `${c.startAt ? new Date(c.startAt).toLocaleDateString() : "…"} – ${c.endAt ? new Date(c.endAt).toLocaleDateString() : "…"}`
          : "Always",
    },
    { key: "status", header: "Status", render: (c) => <Badge tone={c.isActive ? "success" : "neutral"}>{c.isActive ? "Active" : "Inactive"}</Badge> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button
            className="rounded-lg p-2 text-muted hover:bg-surface-container-low hover:text-on-surface"
            aria-label={`Duplicate ${c.title}`}
            onClick={(e) => handleDuplicate(c, e)}
          >
            <Copy size={16} />
          </button>
          <button
            className="rounded-lg p-2 text-muted hover:bg-surface-container-low hover:text-error"
            aria-label={`Delete ${c.title}`}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(c);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collections</h1>
          <p className="text-sm text-muted">Curated lists shown on the customer discovery homepage.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> New collection
        </Button>
      </div>

      <div className="mb-4 max-w-sm">
        <Input placeholder="Search collections…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {!loading && collections.length === 0 ? (
        <EmptyState
          title="No collections yet"
          description="Create your first curated collection, like 'Top Rated in Jammu' or 'Bridal Specialists'."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> New collection
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={collections}
          rowKey={(c) => c.id}
          loading={loading}
          onRowClick={(c) => router.push(`/admin/curation/collections/${c.id}`)}
        />
      )}

      <Modal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="New collection"
        description="Give it a title — you'll set filters, pinned businesses, and scheduling next."
        footer={
          <>
            <Button intent="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={creating}>
              Create
            </Button>
          </>
        }
      >
        <Input label="Title" placeholder="e.g. Best Barbers in Jammu" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This removes the collection and its pinned businesses. Customers will stop seeing it immediately."
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
