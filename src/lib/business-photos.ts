import type { BusinessDetail } from "@/lib/types";

/**
 * The photos to show for a business, in display order. Uploaded gallery photos
 * are the real source of truth (cover first, then sort_order); the legacy
 * banner/image/logo fields are the fallback for businesses set up before the
 * gallery manager existed. Nulls are stripped so callers always get a clean,
 * length-accurate list (used for the "N photos" count and the all-photos page).
 */
export function businessPhotoUrls(
  business: Pick<BusinessDetail, "gallery" | "banner_url" | "image_url" | "logo_url">
): string[] {
  const gallery = business.gallery ?? [];
  if (gallery.length > 0) {
    return [...gallery]
      .sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order)
      .map((g) => g.url);
  }
  return [business.banner_url, business.image_url, business.logo_url].filter(Boolean) as string[];
}
