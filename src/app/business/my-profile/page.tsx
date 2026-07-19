"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useBusinessAuth } from "@/lib/business/auth";
import { useMyProfile, useUpdateMyProfile } from "@/lib/business/hooks/useMyProfile";
import { PortfolioManager } from "@/components/business/PortfolioManager";
import { CertificatesManager } from "@/components/business/CertificatesManager";
import { RowListEditor } from "@/components/business/RowListEditor";
import { SocialLinksForm } from "@/components/business/SocialLinksForm";
import { ProfileCompletionCard, type CompletionItem } from "@/components/business/ProfileCompletionCard";
import type { MemberSocialLinks } from "@/lib/business/types";

type TabKey = "general" | "portfolio" | "certificates" | "social";
const toList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const cleanObject = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => typeof v === "string" && v.trim())) as Partial<T>;

// Maps the backend's profile_missing hints to a done/target checklist so a
// missing item can deep-link to its section.
const completionItemsFrom = (missing: string[]): CompletionItem[] => [
  { label: "Bio", done: !missing.includes("Add a bio"), target: "general" },
  { label: "Languages", done: !missing.includes("Add languages"), target: "general" },
  { label: "Education", done: !missing.includes("Add education"), target: "general" },
  { label: "Awards", done: !missing.includes("Add awards"), target: "general" },
  { label: "Social links", done: !missing.includes("Add social links"), target: "social" },
  { label: "Portfolio", done: !missing.includes("Complete your portfolio"), target: "portfolio" },
  { label: "Certificates", done: !missing.includes("Add certifications"), target: "certificates" },
];

const TABS: { key: TabKey; label: string }[] = [
  { key: "general", label: "General" },
  { key: "portfolio", label: "Portfolio" },
  { key: "certificates", label: "Certificates" },
  { key: "social", label: "Social links" },
];

export default function MyProfilePage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const { data: profile, isLoading, isError, refetch } = useMyProfile(studioId);
  const update = useUpdateMyProfile(studioId);

  const [tab, setTab] = useState<TabKey>("general");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("");
  const [education, setEducation] = useState<Record<string, string>[]>([]);
  const [awards, setAwards] = useState<Record<string, string>[]>([]);
  const [social, setSocial] = useState<MemberSocialLinks>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setBio(profile.bio || "");
    setLanguages((profile.languages ?? []).join(", "));
    setEducation((profile.education ?? []).map((e) => ({ institution: e.institution ?? "", degree: e.degree ?? "", year: e.year ?? "" })));
    setAwards((profile.awards ?? []).map((a) => ({ title: a.title ?? "", year: a.year ?? "" })));
    setSocial(profile.social_links ?? {});
    setDirty(false);
  }, [profile]);

  // Unsaved-changes guard.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const touch = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setDirty(true);
  };

  const completionItems = useMemo(() => completionItemsFrom(profile?.profile_missing ?? []), [profile]);

  const handleSave = () => {
    update.mutate(
      {
        bio: bio.trim() || null,
        languages: toList(languages),
        education: education.filter((e) => e.institution?.trim()),
        awards: awards.filter((a) => a.title?.trim()),
        socialLinks: cleanObject(social),
      },
      {
        onSuccess: () => {
          toast.success("Profile saved");
          setDirty(false);
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't save"),
      }
    );
  };

  if (!studioId) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <EmptyState title="No active business" description="Select a business to manage your professional profile." />
      </div>
    );
  }

  if (isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  // Without this the error path falls through to the skeleton above and spins
  // forever, because `profile` is undefined on failure just as it is while loading.
  if (isError || !profile)
    return <ErrorState onRetry={() => refetch()} description="Couldn't load your profile." />;

  const lockedFields = [
    { label: "Designation", value: profile.designation || "—" },
    { label: "Role", value: profile.role },
    { label: "Experience", value: `${profile.experience_years ?? 0} yrs` },
    { label: "Specializations", value: (profile.specialties ?? []).join(", ") || "—" },
    { label: "Featured services", value: `${(profile.featured_service_ids ?? []).length} selected` },
  ];

  const showSave = tab === "general" || tab === "social";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Profile" description="Manage how you appear to customers. Portfolio and certificate changes save instantly." />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          {/* Tab bar */}
          <div className="flex gap-1 overflow-x-auto border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                  tab === t.key ? "border-primary text-on-surface" : "border-transparent text-muted hover:text-on-surface"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "general" ? (
            <Card className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <Textarea label="Bio" value={bio} onChange={(e) => touch(setBio)(e.target.value)} placeholder="Introduce yourself to customers…" />
                <Input label="Languages" placeholder="English, Hindi" value={languages} onChange={(e) => touch(setLanguages)(e.target.value)} />
                <RowListEditor
                  label="Education"
                  items={education}
                  onChange={touch(setEducation)}
                  makeEmpty={() => ({ institution: "", degree: "", year: "" })}
                  fields={[
                    { key: "institution", placeholder: "Institution" },
                    { key: "degree", placeholder: "Degree (optional)" },
                    { key: "year", placeholder: "Year (optional)" },
                  ]}
                />
                <RowListEditor
                  label="Awards"
                  items={awards}
                  onChange={touch(setAwards)}
                  makeEmpty={() => ({ title: "", year: "" })}
                  fields={[
                    { key: "title", placeholder: "Award" },
                    { key: "year", placeholder: "Year (optional)" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-on-surface">
                  <Lock size={14} /> Managed by your business owner
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  {lockedFields.map((f) => (
                    <div key={f.label} className="flex justify-between gap-2">
                      <span className="text-muted">{f.label}</span>
                      <span className="truncate text-on-surface">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : null}

          {tab === "social" ? (
            <Card className="flex flex-col gap-3">
              <SocialLinksForm value={social} onChange={touch(setSocial)} />
            </Card>
          ) : null}

          {tab === "portfolio" ? <PortfolioManager scope={{ mode: "self", studioId }} /> : null}
          {tab === "certificates" ? <CertificatesManager scope={{ mode: "self", studioId }} /> : null}

          {showSave ? (
            <div className="flex items-center gap-3">
              <Button loading={update.isPending} onClick={handleSave} disabled={!dirty}>
                Save changes
              </Button>
              <span className="text-sm text-muted">{dirty ? "Unsaved changes" : "All changes saved"}</span>
            </div>
          ) : null}
        </div>

        <div className="order-1 lg:order-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge tone="neutral">{profile.role}</Badge>
              <Badge tone={profile.status === "active" ? "success" : "neutral"}>{profile.status}</Badge>
            </div>
            <ProfileCompletionCard completion={profile.profile_completion} items={completionItems} onNavigate={(t) => setTab(t as TabKey)} />
          </div>
        </div>
      </div>
    </div>
  );
}
