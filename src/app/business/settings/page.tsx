"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsPanel } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { TimeSelect } from "@/components/ui/TimeSelect";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { LocationPicker, type LocationValue } from "@/components/business/LocationPicker";
import { useBusinessAuth } from "@/lib/business/auth";
import { PermissionGate, PERMISSIONS } from "@/lib/business/permissions";
import {
  useBusinessProfile,
  useUpdateBusinessProfile,
  useDeactivateBusiness,
  useWorkingHours,
  useUpdateWorkingHours,
  type WorkingHoursDay,
  type SocialLinks,
  type BusinessPolicies,
} from "@/lib/business/hooks/useSettings";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// The list fields are edited as plain text: comma-separated for tag-like lists,
// newline-separated for house rules (each rule is a sentence).
const toList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const toLines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const fromList = (a?: string[]) => (a ?? []).join(", ");
const fromLines = (a?: string[]) => (a ?? []).join("\n");
const cleanObject = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => typeof v === "string" && v.trim())
  ) as Partial<T>;

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "@handle or URL" },
  { key: "facebook", label: "Facebook", placeholder: "page name or URL" },
  { key: "twitter", label: "Twitter / X", placeholder: "@handle or URL" },
  { key: "youtube", label: "YouTube", placeholder: "channel or URL" },
  { key: "tiktok", label: "TikTok", placeholder: "@handle or URL" },
  { key: "linkedin", label: "LinkedIn", placeholder: "company or URL" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "phone number" },
];

const POLICY_FIELDS: { key: keyof BusinessPolicies; label: string }[] = [
  { key: "cancellation", label: "Cancellation policy" },
  { key: "rescheduling", label: "Rescheduling policy" },
  { key: "refund", label: "Refund policy" },
  { key: "general", label: "General policy" },
];

export default function SettingsPage() {
  const { activeMembership } = useBusinessAuth();
  const permissions = activeMembership?.permissions || [];

  return (
    <div>
      <PageHeader title="Settings" description="Business profile, hours, and account controls." />
      <PermissionGate permissions={permissions} require={PERMISSIONS.SETTINGS_MANAGE}>
        <Tabs
          items={[
            { value: "profile", label: "Profile" },
            { value: "hours", label: "Business hours" },
            { value: "danger", label: "Danger zone" },
          ]}
          defaultValue="profile"
        >
          <TabsPanel value="profile">
            <ProfileTab studioId={activeMembership?.studioId} />
          </TabsPanel>
          <TabsPanel value="hours">
            <HoursTab studioId={activeMembership?.studioId} />
          </TabsPanel>
          <TabsPanel value="danger">
            <DangerZoneTab studioId={activeMembership?.studioId} />
          </TabsPanel>
        </Tabs>
      </PermissionGate>
    </div>
  );
}

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  description: "",
  logoUrl: "",
  bannerUrl: "",
  website: "",
  amenities: "",
  languages: "",
  paymentMethods: "",
  accessibility: "",
  houseRules: "",
};

function ProfileTab({ studioId }: { studioId: string | undefined }) {
  const { data: business, isLoading, isError, refetch } = useBusinessProfile(studioId);
  const updateProfile = useUpdateBusinessProfile(studioId);
  const [form, setForm] = useState(EMPTY_FORM);
  const [social, setSocial] = useState<SocialLinks>({});
  const [policies, setPolicies] = useState<BusinessPolicies>({});
  // Phase 4A - the map pin. Kept alongside `form` rather than inside it because
  // lat/lng are numbers, not the text `field()` produces.
  const [location, setLocation] = useState<LocationValue>({ lat: null, lng: null });

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || "",
        phone: business.phone || "",
        email: business.email || "",
        address: business.address || "",
        city: business.city || "",
        state: business.state || "",
        zipCode: business.zip_code || "",
        description: business.description || "",
        logoUrl: business.logo_url || "",
        bannerUrl: business.banner_url || "",
        website: business.website || "",
        amenities: fromList(business.amenities),
        languages: fromList(business.languages),
        paymentMethods: fromList(business.payment_methods),
        accessibility: fromList(business.accessibility),
        houseRules: fromLines(business.house_rules),
      });
      setSocial(business.social_links || {});
      setPolicies(business.policies || {});
      setLocation({
        lat: business.lat ?? null,
        lng: business.lng ?? null,
        address: business.address || undefined,
        city: business.city || undefined,
        state: business.state || undefined,
        zipCode: business.zip_code || undefined,
      });
    }
  }, [business]);

  // When the pin moves (drag or search), mirror the address components it
  // resolved back into the text fields so the two views never disagree.
  const handleLocationChange = (next: LocationValue) => {
    setLocation(next);
    setForm((f) => ({
      ...f,
      address: next.address ?? f.address,
      city: next.city ?? f.city,
      state: next.state ?? f.state,
      zipCode: next.zipCode ?? f.zipCode,
    }));
  };

  if (isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  // Rendering the form on a failed load is worse than showing nothing: every
  // field would be blank (the effect above never ran), and saving that would
  // overwrite the owner's real profile with empty strings.
  if (isError || !business)
    return <ErrorState onRetry={() => refetch()} description="Couldn't load your business profile." />;

  const field = (key: keyof typeof EMPTY_FORM) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleSave = () => {
    updateProfile.mutate(
      {
        name: form.name,
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address,
        city: form.city || undefined,
        state: form.state || undefined,
        zipCode: form.zipCode || undefined,
        lat: location.lat ?? undefined,
        lng: location.lng ?? undefined,
        description: form.description || undefined,
        logoUrl: form.logoUrl || undefined,
        bannerUrl: form.bannerUrl || undefined,
        website: form.website.trim() || null,
        amenities: toList(form.amenities),
        languages: toList(form.languages),
        paymentMethods: toList(form.paymentMethods),
        accessibility: toList(form.accessibility),
        houseRules: toLines(form.houseRules),
        socialLinks: cleanObject(social),
        policies: cleanObject(policies),
      },
      {
        onSuccess: () => toast.success("Business profile updated"),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update profile"),
      }
    );
  };

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <h3 className="font-headline text-base font-semibold text-on-surface">Basics</h3>
        <Input label="Business name" {...field("name")} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Phone" {...field("phone")} />
          <Input label="Email" type="email" {...field("email")} />
        </div>
        <Input label="Address" {...field("address")} />
        <div className="grid grid-cols-3 gap-4">
          <Input label="City" {...field("city")} />
          <Input label="State" {...field("state")} />
          <Input label="ZIP code" {...field("zipCode")} />
        </div>
        <Textarea label="About / description" {...field("description")} />
        <Input label="Logo URL" {...field("logoUrl")} />
        <Input label="Banner URL" {...field("bannerUrl")} />
      </Card>

      <Card className="flex flex-col gap-4">
        <div>
          <h3 className="font-headline text-base font-semibold text-on-surface">Location on map</h3>
          <p className="mt-1 text-sm text-muted">
            This pin is where customers find you on Explore. Drag it to your exact storefront.
          </p>
        </div>
        <LocationPicker value={location} onChange={handleLocationChange} initialQuery={form.address} />
      </Card>

      <Card className="flex flex-col gap-4">
        <h3 className="font-headline text-base font-semibold text-on-surface">Details</h3>
        <p className="-mt-2 text-sm text-muted">Separate multiple values with commas.</p>
        <Input label="Amenities" placeholder="WiFi, Parking, AC" {...field("amenities")} />
        <Input label="Languages spoken" placeholder="English, Hindi" {...field("languages")} />
        <Input label="Payment methods" placeholder="Cash, Card, UPI" {...field("paymentMethods")} />
        <Input label="Accessibility" placeholder="Wheelchair accessible, Accessible parking" {...field("accessibility")} />
      </Card>

      <Card className="flex flex-col gap-4">
        <h3 className="font-headline text-base font-semibold text-on-surface">Website &amp; social</h3>
        <Input label="Website" placeholder="https://…" {...field("website")} />
        <div className="grid grid-cols-2 gap-4">
          {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
            <Input
              key={key}
              label={label}
              placeholder={placeholder}
              value={social[key] || ""}
              onChange={(e) => setSocial((s) => ({ ...s, [key]: e.target.value }))}
            />
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <h3 className="font-headline text-base font-semibold text-on-surface">Policies &amp; house rules</h3>
        {POLICY_FIELDS.map(({ key, label }) => (
          <Textarea
            key={key}
            label={label}
            value={policies[key] || ""}
            onChange={(e) => setPolicies((p) => ({ ...p, [key]: e.target.value }))}
          />
        ))}
        <Textarea label="House rules (one per line)" {...field("houseRules")} />
      </Card>

      <div>
        <Button onClick={handleSave} loading={updateProfile.isPending}>
          Save changes
        </Button>
      </div>
    </div>
  );
}

const hhmm = (t?: string | null) => t?.slice(0, 5) || "";
// Every open day shares one open+close time — the signal for "same for all".
const isUniformHours = (list: WorkingHoursDay[]) => {
  const open = list.filter((d) => !d.isClosed);
  return open.length > 1 && open.every((d) => hhmm(d.openTime) === hhmm(open[0].openTime) && hhmm(d.closeTime) === hhmm(open[0].closeTime));
};

function HoursTab({ studioId }: { studioId: string | undefined }) {
  const { data, isLoading, isError, refetch } = useWorkingHours(studioId);
  const updateHours = useUpdateWorkingHours(studioId);
  const [days, setDays] = useState<WorkingHoursDay[]>([]);
  // When on, one control drives every open day and the per-day pickers lock.
  const [sameForAll, setSameForAll] = useState(false);

  useEffect(() => {
    if (data) {
      setDays(data);
      setSameForAll(isUniformHours(data));
    }
  }, [data]);

  if (isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  if (isError) return <ErrorState onRetry={() => refetch()} description="Couldn't load your working hours." />;
  // `days.length === 0` used to be folded into the loading check, which meant a
  // business with no hours saved yet sat on a skeleton that never resolved.
  if (days.length === 0)
    return (
      <EmptyState
        title="No working hours set"
        description="Set your opening hours so customers know when they can book."
      />
    );

  const updateDay = (dayOfWeek: number, patch: Partial<WorkingHoursDay>) => {
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d)));
  };

  const openDays = days.filter((d) => !d.isClosed);
  const masterOpen = hhmm(openDays[0]?.openTime) || "09:00";
  const masterClose = hhmm(openDays[0]?.closeTime) || "18:00";

  const setAllTimes = (patch: Partial<WorkingHoursDay>) =>
    setDays((prev) => prev.map((d) => (d.isClosed ? d : { ...d, ...patch })));

  const toggleSameForAll = (on: boolean) => {
    setSameForAll(on);
    if (on) setAllTimes({ openTime: masterOpen, closeTime: masterClose });
  };

  return (
    <Card className="max-w-2xl flex flex-col gap-3">
      <div className="flex flex-col gap-3 border-b border-border pb-3">
        <Checkbox
          checked={sameForAll}
          onCheckedChange={toggleSameForAll}
          label="Use the same hours for every open day"
          description="Set one open and close time that applies to all days you're open. Turn this off to set each day individually."
        />
        {sameForAll ? (
          <div className="flex items-center gap-2">
            <span className="w-28 shrink-0 text-sm font-medium text-on-surface">All open days</span>
            <TimeSelect className="w-32" value={masterOpen} onChange={(v) => setAllTimes({ openTime: v })} />
            <span className="text-muted text-sm">to</span>
            <TimeSelect className="w-32" value={masterClose} onChange={(v) => setAllTimes({ closeTime: v })} />
          </div>
        ) : null}
      </div>

      {days
        .slice()
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
        .map((day) => (
          <div key={day.dayOfWeek} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
            <span className="w-28 text-sm font-medium text-on-surface shrink-0">{DAY_LABELS[day.dayOfWeek]}</span>
            <Switch
              checked={!day.isClosed}
              onCheckedChange={(open) =>
                updateDay(day.dayOfWeek, {
                  isClosed: !open,
                  openTime: sameForAll ? masterOpen : day.openTime || "09:00",
                  closeTime: sameForAll ? masterClose : day.closeTime || "18:00",
                })
              }
            />
            {!day.isClosed ? (
              <>
                <TimeSelect className="w-32" disabled={sameForAll} value={day.openTime || ""} onChange={(v) => updateDay(day.dayOfWeek, { openTime: v })} />
                <span className="text-muted text-sm">to</span>
                <TimeSelect className="w-32" disabled={sameForAll} value={day.closeTime || ""} onChange={(v) => updateDay(day.dayOfWeek, { closeTime: v })} />
              </>
            ) : (
              <span className="text-sm text-muted">Closed</span>
            )}
          </div>
        ))}
      <div>
        <Button
          className="mt-2"
          loading={updateHours.isPending}
          onClick={() =>
            updateHours.mutate(days, {
              onSuccess: () => toast.success("Business hours updated"),
              onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update hours"),
            })
          }
        >
          Save hours
        </Button>
      </div>
    </Card>
  );
}

function DangerZoneTab({ studioId }: { studioId: string | undefined }) {
  const deactivateBusiness = useDeactivateBusiness(studioId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Card className="max-w-2xl border-error/30">
        <h3 className="font-headline text-base font-semibold text-error mb-1">Deactivate business</h3>
        <p className="text-sm text-muted mb-4">
          This hides your business from customers and prevents new bookings. This action is not reversible from this dashboard.
        </p>
        <Button intent="danger" onClick={() => setConfirmOpen(true)}>
          Deactivate business
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deactivate this business?"
        description="Your business will no longer be visible to customers or accept new bookings."
        confirmLabel="Deactivate"
        destructive
        loading={deactivateBusiness.isPending}
        onConfirm={() =>
          deactivateBusiness.mutate(undefined, {
            onSuccess: () => {
              toast.success("Business deactivated");
              setConfirmOpen(false);
            },
            onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't deactivate"),
          })
        }
      />
    </>
  );
}
