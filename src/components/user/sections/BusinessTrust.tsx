import { ShieldCheck, TrendingUp, Clock, CalendarDays, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { ICON_SIZE } from "@/lib/design-tokens";
import type { BusinessDetail } from "@/lib/types";

interface BusinessTrustProps {
  business: BusinessDetail;
}

const BAND_TONE: Record<string, string> = {
  Excellent: "text-secondary",
  Great: "text-secondary",
  Good: "text-primary",
  Fair: "text-tertiary",
  Building: "text-muted",
};

const pct = (v: string | number) => Math.round(Number(v) * 100);

const memberSince = (days: number) => {
  const d = new Date(Date.now() - days * 86400000);
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
};

const responseLabel = (mins: number | null) => {
  if (mins == null) return "—";
  if (mins < 60) return `~${mins} min`;
  const h = Math.round(mins / 60);
  return `~${h} hr${h > 1 ? "s" : ""}`;
};

/**
 * Phase 1.4d - the customer-facing trust panel on a business detail page.
 * Surfaces the Phase 1.4a trust score/band, 1.4b verified status, and the
 * headline honored-rate / response-time / tenure / profile-completion signals,
 * plus the 1.4c badges. Renders nothing if the business has no trust data.
 */
export default function BusinessTrust({ business }: BusinessTrustProps) {
  const trust = business.trust;
  if (!trust) return null;

  const honored = 100 - pct(trust.cancellation_rate) - pct(trust.no_show_rate);

  const stats = [
    { icon: CheckCircle2, label: "Appointments honored", value: `${Math.max(0, Math.min(100, honored))}%` },
    { icon: Clock, label: "Usually responds in", value: responseLabel(trust.avg_response_minutes) },
    { icon: CalendarDays, label: "On Revoras since", value: memberSince(trust.business_age_days) },
    { icon: TrendingUp, label: "Profile completion", value: `${trust.profile_completion}%` },
  ];

  return (
    <Card padding="md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 border-border">
            <span className="text-xl font-bold leading-none text-on-surface">{trust.score}</span>
            <span className="text-[10px] text-muted">/ 100</span>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-on-surface">
              Trust score
              <span className={BAND_TONE[trust.band] ?? "text-muted"}>· {trust.band}</span>
            </p>
            {trust.verified ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-secondary">
                <ShieldCheck size={ICON_SIZE.sm} /> Verified business
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted">Not yet verified</p>
            )}
          </div>
        </div>
        <TrustBadges badges={business.badges} className="max-w-xs justify-end" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <s.icon size={ICON_SIZE.sm} className="text-muted" />
            <span className="text-base font-semibold text-on-surface">{s.value}</span>
            <span className="text-xs text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
