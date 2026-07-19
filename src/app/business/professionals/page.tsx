"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Tabs, TabsPanel } from "@/components/ui/Tabs";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PortfolioManager } from "@/components/business/PortfolioManager";
import { CertificatesManager } from "@/components/business/CertificatesManager";
import { RowListEditor } from "@/components/business/RowListEditor";
import { SocialLinksForm } from "@/components/business/SocialLinksForm";
import { ProfileCompletionCard, type CompletionItem } from "@/components/business/ProfileCompletionCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { Divider } from "@/components/ui/Divider";
import { EmptyState } from "@/components/ui/EmptyState";
import { hasPermission, PERMISSIONS } from "@/lib/business/permissions";
import { useBusinessAuth } from "@/lib/business/auth";
import { useMembers, useUpdateMember, useRemoveMember } from "@/lib/business/hooks/useMembers";
import { useTimeOff, useCreateTimeOff, useDeleteTimeOff } from "@/lib/business/hooks/useSettings";
import { useServices } from "@/lib/business/hooks/useServices";
import type { BusinessMemberRow, MemberSocialLinks } from "@/lib/business/types";
import { formatRating } from "@/lib/format";
import { InviteMemberModal } from "@/components/business/InviteMemberModal";
import { PendingInvites } from "@/components/business/PendingInvites";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: Object.values(PERMISSIONS),
  staff: [PERMISSIONS.BOOKINGS_MANAGE],
};

const toList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const cleanObject = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => typeof v === "string" && v.trim())) as Partial<T>;

export default function ProfessionalsPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const canManageTeam = hasPermission(activeMembership?.permissions || [], PERMISSIONS.TEAM_MANAGE);

  const { data: members, isLoading, isError, refetch } = useMembers(studioId);
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<BusinessMemberRow | null>(null);

  const columns: DataTableColumn<BusinessMemberRow>[] = [
    {
      key: "name",
      header: "Professional",
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={m.name} src={m.image_url} size="sm" />
          <div>
            <div className="font-medium text-on-surface">{m.name}</div>
            {m.designation ? <div className="text-xs text-muted">{m.designation}</div> : null}
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (m) => <Badge tone={m.role === "owner" ? "primary" : "neutral"}>{m.role}</Badge> },
    { key: "bookable", header: "Bookable", render: (m) => (m.provides_services ? "Yes" : "No") },
    {
      key: "rating",
      header: "Rating",
      // Not `m.rating ? ...`: an unrated member comes back as the string "0.00",
      // which is truthy. formatRating owns the "is there a rating" decision.
      render: (m) => {
        const rating = formatRating(m.rating);
        return rating === "—" ? rating : `★ ${rating}`;
      },
    },
    {
      key: "status",
      header: "Status",
      render: (m) => <Badge tone={m.status === "active" ? "success" : m.status === "suspended" ? "danger" : "neutral"}>{m.status}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Professionals"
        description="Your team, their roles, and their schedules."
        actions={
          canManageTeam ? (
            <Button onClick={() => setAddOpen(true)}>
              <Plus size={16} /> Add member
            </Button>
          ) : undefined
        }
      />

      {canManageTeam ? <PendingInvites studioId={studioId} /> : null}

      {isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load your team." />
      ) : (
        <DataTable
          columns={columns}
          data={members || []}
          rowKey={(m) => m.id}
          loading={isLoading}
          onRowClick={(m) => setSelected(m)}
          emptyTitle="No team members yet"
          emptyDescription="Add your first professional to start taking bookings."
        />
      )}

      {canManageTeam ? <InviteMemberModal studioId={studioId} open={addOpen} onOpenChange={setAddOpen} /> : null}

      <MemberDrawer
        studioId={studioId}
        member={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        canManage={canManageTeam}
      />
    </div>
  );
}

function MemberDrawer({
  studioId,
  member,
  open,
  onOpenChange,
  canManage,
}: {
  studioId: string | undefined;
  member: BusinessMemberRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canManage: boolean;
}) {
  const updateMember = useUpdateMember(studioId);
  const removeMember = useRemoveMember(studioId);
  const timeOff = useTimeOff(studioId, { businessMemberId: member?.id });
  const createTimeOff = useCreateTimeOff(studioId);
  const deleteTimeOff = useDeleteTimeOff(studioId);

  const { data: services } = useServices(studioId, true);

  const [form, setForm] = useState({ designation: "", bio: "", languages: "", experienceYears: 0, specialties: "" });
  const [education, setEducation] = useState<Record<string, string>[]>([]);
  const [awards, setAwards] = useState<Record<string, string>[]>([]);
  const [social, setSocial] = useState<MemberSocialLinks>({});
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [timeOffForm, setTimeOffForm] = useState({ date: "", isFullDay: true, reason: "" });

  useEffect(() => {
    if (!member) return;
    setForm({
      designation: member.designation || "",
      bio: member.bio || "",
      languages: (member.languages ?? []).join(", "),
      experienceYears: member.experience_years ?? 0,
      specialties: (member.specialties ?? []).join(", "),
    });
    setEducation((member.education ?? []).map((e) => ({ institution: e.institution ?? "", degree: e.degree ?? "", year: e.year ?? "" })));
    setAwards((member.awards ?? []).map((a) => ({ title: a.title ?? "", year: a.year ?? "" })));
    setSocial(member.social_links ?? {});
    setFeaturedIds(member.featured_service_ids ?? []);
  }, [member]);

  // Live completion checklist (updates as the owner edits, before saving).
  const completionItems: CompletionItem[] = [
    { label: "Designation", done: !!form.designation },
    { label: "Bio", done: !!form.bio.trim() },
    { label: "Photo", done: !!member?.image_url },
    { label: "Specializations", done: toList(form.specialties).length > 0 },
    { label: "Experience", done: Number(form.experienceYears) > 0 },
    { label: "Languages", done: toList(form.languages).length > 0 },
    { label: "Education", done: education.some((e) => e.institution?.trim()) },
    { label: "Awards", done: awards.some((a) => a.title?.trim()) },
    { label: "Social links", done: Object.values(social).some((v) => v && v.trim()) },
    { label: "Featured services", done: featuredIds.length > 0 },
  ];
  const completion = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  if (!member) return null;

  const toggleFeatured = (id: string) =>
    setFeaturedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const handleSaveProfile = () =>
    updateMember.mutate(
      {
        memberId: member.id,
        designation: form.designation || null,
        bio: form.bio.trim() || null,
        languages: toList(form.languages),
        experienceYears: Number(form.experienceYears) || 0,
        specialties: toList(form.specialties),
        education: education.filter((e) => e.institution?.trim()),
        awards: awards.filter((a) => a.title?.trim()),
        socialLinks: cleanObject(social),
        featuredServiceIds: featuredIds,
      },
      { onSuccess: () => toast.success("Profile updated"), onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update") }
    );

  const permissions = ROLE_PERMISSIONS[member.role] || [];

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} title={member.name} description={member.designation || member.role}>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Badge tone={member.role === "owner" ? "primary" : "neutral"}>{member.role}</Badge>
            <Badge tone={member.status === "active" ? "success" : "neutral"}>{member.status}</Badge>
          </div>

          {canManage ? (
            <Tabs
              items={[
                { value: "profile", label: "Profile" },
                { value: "portfolio", label: "Portfolio" },
                { value: "certificates", label: "Certificates" },
              ]}
              defaultValue="profile"
            >
              <TabsPanel value="profile">
                <div className="flex flex-col gap-6">
              <ProfileCompletionCard completion={completion} items={completionItems} />

              {/* Personal */}
              <div className="flex flex-col gap-3">
                <div className="text-sm font-semibold text-on-surface">Personal</div>
                <Input label="Designation" value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} placeholder="e.g. Senior Stylist" />
                <Textarea label="Bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Introduce this professional…" />
                <Input label="Years of experience" type="number" min={0} value={form.experienceYears} onChange={(e) => setForm((f) => ({ ...f, experienceYears: Number(e.target.value) }))} />
                <Input label="Specializations" placeholder="Fades, Beard, Coloring" value={form.specialties} onChange={(e) => setForm((f) => ({ ...f, specialties: e.target.value }))} />
                <Input label="Languages" placeholder="English, Hindi" value={form.languages} onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))} />
              </div>

              {/* Professional background */}
              <div className="flex flex-col gap-4">
                <div className="text-sm font-semibold text-on-surface">Professional background</div>
                <RowListEditor
                  label="Education"
                  items={education}
                  onChange={setEducation}
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
                  onChange={setAwards}
                  makeEmpty={() => ({ title: "", year: "" })}
                  fields={[
                    { key: "title", placeholder: "Award" },
                    { key: "year", placeholder: "Year (optional)" },
                  ]}
                />
              </div>

              {/* Social */}
              <div className="flex flex-col gap-3">
                <div className="text-sm font-semibold text-on-surface">Social</div>
                <SocialLinksForm value={social} onChange={setSocial} />
              </div>

              {/* Featured services */}
              <div className="flex flex-col gap-2">
                <div className="text-sm font-semibold text-on-surface">Featured services</div>
                {services && services.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {services.map((s) => (
                      <Checkbox key={s.id} label={s.name} checked={featuredIds.includes(s.id)} onCheckedChange={() => toggleFeatured(s.id)} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted">No active services to feature yet.</p>
                )}
              </div>

              <Button loading={updateMember.isPending} onClick={handleSaveProfile}>
                Save profile
              </Button>
                </div>
              </TabsPanel>
              <TabsPanel value="portfolio">
                <PortfolioManager scope={{ mode: "owner", studioId: studioId ?? "", memberId: member.id }} />
              </TabsPanel>
              <TabsPanel value="certificates">
                <CertificatesManager scope={{ mode: "owner", studioId: studioId ?? "", memberId: member.id }} />
              </TabsPanel>
            </Tabs>
          ) : null}

          <Divider />

          <div>
            <div className="text-sm font-semibold text-on-surface mb-2">Effective permissions</div>
            <p className="text-xs text-muted mb-2">Based on this person&apos;s role — per-member overrides aren&apos;t supported yet.</p>
            <div className="flex flex-wrap gap-1.5">
              {permissions.map((p) => (
                <Badge key={p} tone="neutral">
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          <Divider />

          <div>
            <div className="text-sm font-semibold text-on-surface mb-2">Time off</div>
            {timeOff.isLoading ? null : timeOff.data && timeOff.data.length > 0 ? (
              <div className="flex flex-col gap-2 mb-3">
                {timeOff.data.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2 text-sm">
                    <span>
                      {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {t.is_full_day ? " · Full day" : ` · ${t.start_time?.slice(0, 5)}–${t.end_time?.slice(0, 5)}`}
                      {t.reason ? ` · ${t.reason}` : ""}
                    </span>
                    <button
                      className="text-xs text-error hover:underline"
                      onClick={() => deleteTimeOff.mutate(t.id, { onSuccess: () => toast.success("Removed") })}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No time off scheduled" className="py-6" />
            )}

            <div className="flex flex-col gap-2">
              <Input type="date" value={timeOffForm.date} onChange={(e) => setTimeOffForm((f) => ({ ...f, date: e.target.value }))} />
              <Switch
                label="Full day"
                checked={timeOffForm.isFullDay}
                onCheckedChange={(v) => setTimeOffForm((f) => ({ ...f, isFullDay: v }))}
              />
              <Input
                placeholder="Reason (optional)"
                value={timeOffForm.reason}
                onChange={(e) => setTimeOffForm((f) => ({ ...f, reason: e.target.value }))}
              />
              <Button
                size="sm"
                intent="outline"
                loading={createTimeOff.isPending}
                onClick={() => {
                  if (!timeOffForm.date) {
                    toast.error("Pick a date");
                    return;
                  }
                  createTimeOff.mutate(
                    { businessMemberId: member.id, date: timeOffForm.date, isFullDay: timeOffForm.isFullDay, reason: timeOffForm.reason || undefined },
                    {
                      onSuccess: () => {
                        toast.success("Time off added");
                        setTimeOffForm({ date: "", isFullDay: true, reason: "" });
                      },
                      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't add time off"),
                    }
                  );
                }}
              >
                Add time off
              </Button>
            </div>
          </div>

          {canManage && member.status !== "inactive" ? (
            <>
              <Divider />
              <Button intent="danger" size="sm" onClick={() => setConfirmRemove(true)}>
                Deactivate member
              </Button>
            </>
          ) : null}
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmRemove}
        onOpenChange={setConfirmRemove}
        title={`Deactivate ${member.name}?`}
        description="They'll no longer appear as bookable and will lose access to this business's dashboard."
        confirmLabel="Deactivate"
        destructive
        loading={removeMember.isPending}
        onConfirm={() =>
          removeMember.mutate(member.id, {
            onSuccess: () => {
              toast.success("Member deactivated");
              setConfirmRemove(false);
              onOpenChange(false);
            },
          })
        }
      />
    </>
  );
}
