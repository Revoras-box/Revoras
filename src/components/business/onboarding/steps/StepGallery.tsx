"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useGallery,
  useAddGalleryImage,
  useRemoveGalleryImage,
  useSetGalleryCover,
} from "@/lib/business/hooks/useOnboarding";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

// The categories are guidance for what to photograph — the backend stores a flat
// ordered gallery (first image = cover), so these are cosmetic prompts only.
const SUGGESTIONS = ["Cover shot", "Interior", "Exterior", "Workspace"];

export function StepGallery({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: images, isLoading } = useGallery(studioId);
  const addImage = useAddGalleryImage(studioId);
  const removeImage = useRemoveGalleryImage(studioId);
  const setCover = useSetGalleryCover(studioId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const hasImage = (images || []).length > 0;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} isn't an image`);
          continue;
        }
        await addImage.mutateAsync(file);
      }
      toast.success("Photos uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <StepHeader
        eyebrow="Step 6 of 10"
        title="Gallery"
        description="Show off your space. Great photos build trust — add at least one to continue. Your first photo becomes the cover."
      />

      <div className="max-w-2xl">
        <div className="mb-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>

        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />

        {isLoading ? (
          <Skeleton className="h-48 rounded-2xl" />
        ) : !hasImage ? (
          <Card>
            <EmptyState
              icon={<ImagePlus size={28} />}
              title="No photos yet"
              description="Upload photos of your business so customers know what to expect."
              action={
                <Button onClick={() => inputRef.current?.click()} loading={uploading}>
                  <ImagePlus size={16} /> Upload photos
                </Button>
              }
            />
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(images || []).map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-container-low">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  {img.is_cover ? (
                    <Badge tone="primary" className="absolute left-2 top-2">
                      Cover
                    </Badge>
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {!img.is_cover ? (
                      <button
                        className="rounded-lg bg-white/90 p-1.5 text-neutral-800 hover:bg-white"
                        aria-label="Set as cover"
                        onClick={() => setCover.mutate(img.id, { onSuccess: () => toast.success("Cover updated") })}
                      >
                        <Star size={14} />
                      </button>
                    ) : null}
                    <button
                      className="rounded-lg bg-white/90 p-1.5 text-error hover:bg-white"
                      aria-label="Remove photo"
                      onClick={() => removeImage.mutate(img.id, { onSuccess: () => toast.success("Photo removed") })}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button intent="outline" size="sm" onClick={() => inputRef.current?.click()} loading={uploading}>
                <ImagePlus size={16} /> Add more
              </Button>
            </div>
          </>
        )}
      </div>

      <WizardFooter
        onPrev={goPrev}
        onNext={() => goNext()}
        onExit={exit}
        nextDisabled={!hasImage}
        nextLoading={saving}
        hint={!hasImage ? "Upload at least one photo to continue." : undefined}
      />
    </div>
  );
}
