import { BadgeCheck, Crown, Star, Flame, TrendingUp, Sparkles, Award, ShieldCheck } from "lucide-react";
import { Badge, type BadgeProps } from "./Badge";
import { cn } from "@/lib/utils";
import type { TrustBadge } from "@/lib/types";

/**
 * Phase 1.4d - renders the Phase 1.4c trust/quality badges consistently
 * wherever they appear (discovery cards, business detail, professional detail,
 * the Verification Center preview). Badge keys map to a fixed tone + icon here
 * so a "Verified" badge looks identical everywhere; unknown keys degrade
 * gracefully to a neutral chip using the server-provided label.
 */
const BADGE_STYLE: Record<string, { tone: NonNullable<BadgeProps["tone"]>; icon: React.ComponentType<{ size?: number }> }> = {
  verified: { tone: "success", icon: BadgeCheck },
  verified_professional: { tone: "success", icon: ShieldCheck },
  // Premium reads as an outline chip, not a filled jade one: jade is reserved
  // for actions (CTA/focus/active/selected) rather than status, and a filled
  // brand chip next to the filled "Verified" chip spent the accent budget twice
  // on one card.
  premium: { tone: "outline", icon: Crown },
  top_rated: { tone: "warning", icon: Star },
  top: { tone: "warning", icon: Star },
  popular: { tone: "primary", icon: Flame },
  trending: { tone: "primary", icon: TrendingUp },
  new: { tone: "neutral", icon: Sparkles },
  master: { tone: "primary", icon: Award },
  expert: { tone: "primary", icon: Award },
  senior: { tone: "neutral", icon: Award },
};

export interface TrustBadgesProps {
  badges: TrustBadge[] | undefined;
  className?: string;
  /** Show only the first N; the rest collapse into a "+N" chip. */
  max?: number;
  size?: number;
}

export function TrustBadges({ badges, className, max, size = 13 }: TrustBadgesProps) {
  if (!badges || badges.length === 0) return null;
  const shown = max ? badges.slice(0, max) : badges;
  const overflow = max ? badges.length - shown.length : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {shown.map((b) => {
        const style = BADGE_STYLE[b.key] ?? { tone: "neutral" as const, icon: undefined };
        const Icon = style.icon;
        return (
          <Badge key={b.key} tone={style.tone}>
            {Icon ? <Icon size={size} /> : null}
            {b.label}
          </Badge>
        );
      })}
      {overflow > 0 ? <Badge tone="neutral">+{overflow}</Badge> : null}
    </div>
  );
}
