"use client";

import { Check, CircleAlert, Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useBusinessProfile, useWorkingHours } from "@/lib/business/hooks/useSettings";
import { useServices, useServiceCategories } from "@/lib/business/hooks/useServices";
import { useMembers } from "@/lib/business/hooks/useMembers";
import { useGallery, useDocuments } from "@/lib/business/hooks/useOnboarding";
import { formatINR } from "@/lib/format";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

// Wizard step indices (must match STEP_COMPONENTS in OnboardingWizard.tsx).
const STEP = {
  basics: 0,
  location: 1,
  information: 2,
  services: 3,
  professionals: 4,
  gallery: 5,
  hours: 6,
  documents: 7,
} as const;

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hhmm = (t?: string | null) => (t ? t.slice(0, 5) : "");
const orDash = (a?: string[] | null) => (a && a.length ? a.join(", ") : "");

// One read-only label/value row. Empty values render a muted "Not set" so the
// review always shows the full shape of the form, not just the filled bits.
function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  const empty = value == null || (typeof value === "string" && value.trim() === "");
  return (
    <div className="flex flex-col gap-0.5 py-1.5 sm:flex-row sm:gap-4">
      <div className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted sm:w-44 sm:pt-0.5">{label}</div>
      <div className="min-w-0 break-words text-sm text-on-surface">
        {empty ? <span className="text-muted">Not set</span> : value}
      </div>
    </div>
  );
}

// A titled card with a completion dot and an Edit shortcut back to its step.
function Section({
  title,
  done,
  onEdit,
  children,
}: {
  title: string;
  done?: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          {done !== undefined ? (
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                done ? "bg-secondary-container text-on-secondary-container" : "bg-tertiary-container text-on-surface"
              }`}
            >
              {done ? <Check size={14} /> : <CircleAlert size={14} />}
            </span>
          ) : null}
          <h3 className="font-headline text-base font-semibold text-on-surface">{title}</h3>
        </div>
        <button
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
          onClick={onEdit}
        >
          <Pencil size={12} /> Edit
        </button>
      </div>
      {children}
    </Card>
  );
}

export function StepReview({ studioId, state, goNext, goPrev, jumpTo, exit, saving }: WizardStepProps) {
  const { data: business } = useBusinessProfile(studioId);
  const { data: services } = useServices(studioId, false);
  const { data: members } = useMembers(studioId);
  const { data: gallery } = useGallery(studioId);
  const { data: hours } = useWorkingHours(studioId);
  const { data: documents } = useDocuments(studioId);
  const { data: categories } = useServiceCategories();

  const activeServices = (services || []).filter((s) => s.is_active);
  const galleryImages = gallery || [];
  const memberList = members || [];
  const docs = documents || [];
  const categoryName = (id?: string) => categories?.find((c) => c.id === id)?.name || "";

  const social = business?.social_links || {};
  const socialEntries = Object.entries(social).filter(([, v]) => v && v.trim());
  const policies = business?.policies || {};
  const policyEntries = Object.entries(policies).filter(([, v]) => v && v.trim());

  const percent = state.completionPercent;

  return (
    <div>
      <StepHeader
        eyebrow="Step 9 of 10"
        title="Review your business"
        description="Here's everything you've entered, in one place. Scroll through to check it, and edit any section that isn't right before you submit."
      />

      <div className="flex max-w-2xl flex-col gap-6">
        {/* Completion summary */}
        <Card className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted">Profile completion</div>
            <div className="font-headline text-3xl font-semibold text-on-surface">{percent}%</div>
          </div>
          <div className="w-40">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
            {state.missing.length > 0 ? (
              <p className="mt-2 text-right text-xs text-error">Missing: {state.missing.join(", ")}</p>
            ) : (
              <p className="mt-2 text-right text-xs text-primary">Ready to submit</p>
            )}
          </div>
        </Card>

        {/* Business basics */}
        <Section
          title="Business basics"
          done={!!(business?.name && business?.address && business?.category_id)}
          onEdit={() => jumpTo(STEP.basics)}
        >
          <div className="flex flex-col divide-y divide-border/60">
            <Field label="Business name" value={business?.name} />
            <Field label="Category" value={categoryName(business?.category_id)} />
            <Field label="Phone" value={business?.phone} />
            <Field label="Email" value={business?.email} />
          </div>
        </Section>

        {/* Location */}
        <Section
          title="Location"
          done={business?.lat != null && business?.lng != null}
          onEdit={() => jumpTo(STEP.location)}
        >
          <div className="flex flex-col divide-y divide-border/60">
            <Field label="Address" value={business?.address} />
            <Field label="City" value={business?.city} />
            <Field label="State" value={business?.state} />
            <Field label="Country" value={business?.country} />
            <Field label="PIN / ZIP code" value={business?.zip_code} />
            <Field
              label="Map pin"
              value={
                business?.lat != null && business?.lng != null
                  ? `${business.lat.toFixed(5)}, ${business.lng.toFixed(5)}`
                  : undefined
              }
            />
          </div>
        </Section>

        {/* Business information */}
        <Section title="Business information" done={!!business?.description} onEdit={() => jumpTo(STEP.information)}>
          <div className="flex flex-col divide-y divide-border/60">
            <Field label="Description" value={business?.description} />
            <Field label="Website" value={business?.website} />
            <Field label="Amenities" value={orDash(business?.amenities)} />
            <Field label="Languages" value={orDash(business?.languages)} />
            <Field label="Payment methods" value={orDash(business?.payment_methods)} />
            <Field label="Accessibility" value={orDash(business?.accessibility)} />
            <Field
              label="House rules"
              value={
                business?.house_rules && business.house_rules.length ? (
                  <ul className="list-disc space-y-0.5 pl-4">
                    {business.house_rules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                ) : undefined
              }
            />
            <Field
              label="Social links"
              value={
                socialEntries.length ? (
                  <div className="flex flex-col gap-0.5">
                    {socialEntries.map(([k, v]) => (
                      <span key={k} className="capitalize">
                        {k}: <span className="text-muted">{v}</span>
                      </span>
                    ))}
                  </div>
                ) : undefined
              }
            />
          </div>
        </Section>

        {/* Policies */}
        <Section title="Policies" done={policyEntries.length > 0} onEdit={() => jumpTo(STEP.information)}>
          {policyEntries.length ? (
            <div className="flex flex-col divide-y divide-border/60">
              {policyEntries.map(([k, v]) => (
                <Field key={k} label={k} value={v} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No policies added yet.</p>
          )}
        </Section>

        {/* Services */}
        <Section title="Services" done={activeServices.length > 0} onEdit={() => jumpTo(STEP.services)}>
          {activeServices.length ? (
            <div className="flex flex-col divide-y divide-border/60">
              {activeServices.map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-2">
                  {s.image_url ? (
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-container-low">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image_url} alt="" className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-on-surface">{s.name}</div>
                    <div className="truncate text-xs text-muted">
                      {s.custom_category || categoryName(s.category_id)}
                      {s.description ? ` · ${s.description}` : ""}
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-sm">
                    <div className="font-medium text-on-surface tabular-nums">{formatINR(s.price)}</div>
                    <div className="text-xs text-muted">{s.duration} min</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No services added yet.</p>
          )}
        </Section>

        {/* Professionals */}
        <Section title="Professionals" done={memberList.length > 0} onEdit={() => jumpTo(STEP.professionals)}>
          {memberList.length ? (
            <div className="flex flex-col divide-y divide-border/60">
              {memberList.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-on-surface">{m.name}</div>
                    <div className="truncate text-xs text-muted">{m.designation || m.role}</div>
                  </div>
                  <Badge tone={m.status === "active" ? "success" : "neutral"}>{m.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No team members added yet.</p>
          )}
        </Section>

        {/* Gallery */}
        <Section title="Gallery" done={galleryImages.length > 0} onEdit={() => jumpTo(STEP.gallery)}>
          {galleryImages.length ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {galleryImages.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-container-low">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  {img.is_cover ? (
                    <Badge tone="primary" className="absolute left-1 top-1 text-[10px]">
                      Cover
                    </Badge>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No photos added yet.</p>
          )}
        </Section>

        {/* Business hours */}
        <Section title="Business hours" done onEdit={() => jumpTo(STEP.hours)}>
          {hours && hours.length ? (
            <div className="flex flex-col divide-y divide-border/60">
              {[...hours]
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((d) => (
                  <div key={d.dayOfWeek} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-on-surface">{DAY_LABELS[d.dayOfWeek]}</span>
                    <span className={d.isClosed ? "text-muted" : "text-on-surface tabular-nums"}>
                      {d.isClosed ? "Closed" : `${hhmm(d.openTime)} – ${hhmm(d.closeTime)}`}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Hours not set yet.</p>
          )}
        </Section>

        {/* Documents */}
        <Section title="Documents" done={docs.length > 0} onEdit={() => jumpTo(STEP.documents)}>
          {docs.length ? (
            <div className="flex flex-col divide-y divide-border/60">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium capitalize text-on-surface">{d.doc_type}</div>
                    {d.original_name ? <div className="truncate text-xs text-muted">{d.original_name}</div> : null}
                  </div>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-medium text-primary hover:underline"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No documents uploaded yet.</p>
          )}
        </Section>
      </div>

      <WizardFooter onPrev={goPrev} onNext={() => goNext()} onExit={exit} nextLoading={saving} nextLabel="Continue to subscription" />
    </div>
  );
}
