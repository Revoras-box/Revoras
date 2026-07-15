/**
 * Non-CSS design tokens — values components pass to JS APIs (lucide-react's
 * `size` prop, animation libraries) rather than express as a class name.
 * CSS-expressible tokens (color, radius, elevation, z-index, motion
 * duration/easing) live in `globals.css` as the single source of truth.
 */
export const ICON_SIZE = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export type IconSize = keyof typeof ICON_SIZE;
