import {
  Brush,
  Flower2,
  type LucideIcon,
  Palette,
  Scissors,
  Smile,
  Sparkles,
  Tag,
  User,
} from "lucide-react";

/**
 * Turns the `categories.icon` value into something you can actually see.
 *
 * That column stores **Material Symbols ligature names** — `content_cut`,
 * `auto_awesome`, `face_retouching_natural`. Material renders those by loading a
 * font where the literal text is swapped for a glyph. This app uses
 * lucide-react and never loads that font, so the string was being printed as-is:
 * the Discover category pills read "content_cut Barbershop" and
 * "face_retouching_natural Beauty Studio". Not a styling problem — the wrong
 * icon system's identifiers rendered as prose.
 *
 * Mapping here rather than rewriting the column, because the data is not wrong:
 * a category naming its icon is reasonable, and the seed, the admin category
 * editor and any existing rows all speak Material. Translating at the render
 * boundary keeps one edit in one file; migrating the column would mean changing
 * every writer of it and re-seeding, for the same visual result.
 *
 * Unknown values fall back to a neutral tag rather than throwing or printing the
 * raw name, so a category added later with an unmapped icon degrades to a
 * generic pill instead of reintroducing the bug.
 */
const ICON_BY_NAME: Record<string, LucideIcon> = {
  content_cut: Scissors,
  auto_awesome: Sparkles,
  face_retouching_natural: Smile,
  spa: Flower2,
  brush: Brush,
  face: User,
  palette: Palette,
  category: Tag,
};

export const categoryIconFor = (icon?: string | null): LucideIcon =>
  (icon && ICON_BY_NAME[icon]) || Tag;

/** Ready-to-render node for the `icon` prop on Chip/CategoryChip. */
export function CategoryIcon({ icon, size = 14 }: { icon?: string | null; size?: number }) {
  const Icon = categoryIconFor(icon);
  return <Icon size={size} aria-hidden="true" />;
}
