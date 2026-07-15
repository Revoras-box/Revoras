import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-container text-on-primary-container font-label font-medium select-none",
  {
    variants: {
      size: {
        sm: "h-7 w-7 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-14 w-14 text-base",
        xl: "h-20 w-20 text-xl",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null;
  /** Person or business name — used both for alt text and the initials fallback. */
  name: string;
  className?: string;
}

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/** Photo avatar with an initials fallback — never a broken-image icon. */
export function Avatar({ src, name, size, className }: AvatarProps) {
  return (
    <span className={cn(avatarVariants({ size, className }))}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar sources are arbitrary remote URLs, not build-time assets
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <>
          <span aria-hidden="true">{initialsOf(name)}</span>
          <span className="sr-only">{name}</span>
        </>
      )}
    </span>
  );
}
