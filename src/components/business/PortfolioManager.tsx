"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Star, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePortfolio, usePortfolioMutations } from "@/lib/business/hooks/usePortfolio";
import type { PortfolioImage, MediaScope } from "@/lib/business/types";

const errText = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback);

// Shared by the owner Team drawer (scope.mode="owner") and the professional's
// own My Profile page (scope.mode="self"). Identical behaviour in both.
export function PortfolioManager({ scope }: { scope: MediaScope }) {
  const { data: images, isLoading } = usePortfolio(scope);
  const { add, reorder, setCover, updateCaption, remove } = usePortfolioMutations(scope);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);
  const [order, setOrder] = useState<PortfolioImage[]>([]);

  useEffect(() => {
    if (images) setOrder(images);
  }, [images]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    add.mutate(form, {
      onSuccess: () => toast.success("Image uploaded"),
      onError: (err) => toast.error(errText(err, "Couldn't upload")),
    });
  };

  const handleDrop = (dropIndex: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === dropIndex) return;
    const next = order.slice();
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    setOrder(next);
    reorder.mutate(
      next.map((i) => i.id),
      { onError: (err) => toast.error(errText(err, "Couldn't reorder")) }
    );
  };

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  return (
    <div className="flex flex-col gap-4">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <Button size="sm" intent="secondary" loading={add.isPending} onClick={() => fileRef.current?.click()}>
        <Upload size={16} /> Upload image
      </Button>

      {order.length === 0 ? (
        <EmptyState title="No portfolio images yet" description="Upload work samples to showcase your work." className="py-8" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {order.map((img, i) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => (dragIndex.current = i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                className="overflow-hidden rounded-xl border border-border"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.media_url} alt={img.caption ?? "Portfolio image"} className="aspect-square w-full object-cover" />
                  {img.is_cover ? (
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-on-primary">Cover</span>
                  ) : null}
                  <div className="absolute right-2 top-2 flex gap-1">
                    {!img.is_cover ? (
                      <button
                        type="button"
                        title="Set as cover"
                        onClick={() => setCover.mutate(img.id)}
                        className="rounded-full bg-surface/80 p-1.5 text-on-surface hover:bg-surface"
                      >
                        <Star size={14} />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => remove.mutate(img.id, { onSuccess: () => toast.success("Image removed") })}
                      className="rounded-full bg-surface/80 p-1.5 text-error hover:bg-surface"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 p-2">
                  <GripVertical size={14} className="shrink-0 cursor-grab text-muted" />
                  <Input
                    className="h-8 text-xs"
                    placeholder="Caption (optional)"
                    defaultValue={img.caption ?? ""}
                    onBlur={(e) => {
                      if (e.target.value !== (img.caption ?? "")) {
                        updateCaption.mutate({ imageId: img.id, caption: e.target.value });
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted">Drag images to reorder. The first image is used as the cover.</p>
        </>
      )}
    </div>
  );
}
