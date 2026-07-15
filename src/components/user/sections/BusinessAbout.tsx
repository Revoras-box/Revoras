import { Globe, Instagram, Facebook, Youtube, Linkedin, Twitter, MessageCircle, Music2, Link2 } from "lucide-react";
import { Card, Section } from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";
import type { BusinessDetail } from "@/lib/types";

interface BusinessAboutProps {
  business: BusinessDetail;
}

function ChipList({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-on-surface">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-surface-container-high px-3 py-1 text-sm text-muted">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// Known platforms get a real icon + a best-effort URL. A stored value that's
// already a full URL is used verbatim; otherwise a platform URL is built from
// the handle. Unknown/whatsapp fall back gracefully.
const SOCIAL_META: Record<string, { Icon: typeof Globe; label: string; base: (v: string) => string }> = {
  instagram: { Icon: Instagram, label: "Instagram", base: (v) => `https://instagram.com/${v.replace(/^@/, "")}` },
  facebook: { Icon: Facebook, label: "Facebook", base: (v) => `https://facebook.com/${v}` },
  twitter: { Icon: Twitter, label: "Twitter", base: (v) => `https://twitter.com/${v.replace(/^@/, "")}` },
  youtube: { Icon: Youtube, label: "YouTube", base: (v) => `https://youtube.com/${v}` },
  tiktok: { Icon: Music2, label: "TikTok", base: (v) => `https://tiktok.com/@${v.replace(/^@/, "")}` },
  linkedin: { Icon: Linkedin, label: "LinkedIn", base: (v) => `https://linkedin.com/company/${v}` },
  whatsapp: { Icon: MessageCircle, label: "WhatsApp", base: (v) => `https://wa.me/${v.replace(/[^\d]/g, "")}` },
};

const hrefFor = (key: string, value: string) => {
  if (/^https?:\/\//i.test(value)) return value;
  return SOCIAL_META[key]?.base(value) ?? value;
};

export default function BusinessAbout({ business }: BusinessAboutProps) {
  const amenities = business.amenities ?? [];
  const languages = business.languages ?? [];
  const paymentMethods = business.payment_methods ?? [];
  const accessibility = business.accessibility ?? [];
  const socialLinks = business.social_links ?? {};
  const website = business.website;
  const description = business.description;

  const socialEntries = Object.entries(socialLinks).filter(([, v]) => v);
  const hasGoodToKnow = amenities.length || languages.length || paymentMethods.length || accessibility.length;
  const hasConnect = Boolean(website) || socialEntries.length > 0;

  if (!description && !hasGoodToKnow && !hasConnect) return null;

  return (
    <Section title="About">
      <div className="flex flex-col gap-4">
        {description ? (
          <Card padding="md">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{description}</p>
          </Card>
        ) : null}

        {hasGoodToKnow ? (
          <Card padding="md">
            <div className="flex flex-col gap-5">
              <ChipList label="Amenities" items={amenities} />
              <ChipList label="Languages spoken" items={languages} />
              <ChipList label="Payment methods" items={paymentMethods} />
              <ChipList label="Accessibility" items={accessibility} />
            </div>
          </Card>
        ) : null}

        {hasConnect ? (
          <Card padding="md">
            <h4 className="mb-3 text-sm font-semibold text-on-surface">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {website ? (
                <a
                  href={/^https?:\/\//i.test(website) ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  <Globe size={ICON_SIZE.sm} /> Website
                </a>
              ) : null}
              {socialEntries.map(([key, value]) => {
                const meta = SOCIAL_META[key];
                const Icon = meta?.Icon ?? Link2;
                return (
                  <a
                    key={key}
                    href={hrefFor(key, value as string)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-surface-container-high"
                  >
                    <Icon size={ICON_SIZE.sm} /> {meta?.label ?? key}
                  </a>
                );
              })}
            </div>
          </Card>
        ) : null}
      </div>
    </Section>
  );
}
