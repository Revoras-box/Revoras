"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Mail, MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { useCreateInvite } from "@/lib/business/hooks/useInvites";
import type { CreatedInvite } from "@/lib/business/types";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  roleKey: "staff" as "owner" | "staff",
  designation: "",
  providesServices: true,
  experienceYears: 0,
};

/**
 * Replaces the old "add by email, they must already have an account" modal.
 * A salon owner adding a barber usually has a phone number and nothing else,
 * and the barber has no Revoras account - that flow dead-ended on a 404.
 *
 * The invite link is the product, not the email. Delivery by email is offered
 * when there's an address, but the copyable link is always shown because
 * WhatsApp is how this actually reaches people here.
 */
export function InviteMemberModal({
  studioId,
  open,
  onOpenChange,
}: {
  studioId: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createInvite = useCreateInvite(studioId);
  const [form, setForm] = useState(EMPTY);
  const [created, setCreated] = useState<CreatedInvite | null>(null);
  const [copied, setCopied] = useState(false);

  const close = () => {
    onOpenChange(false);
    // Reset only after the close animation, so the form doesn't visibly clear.
    setTimeout(() => {
      setForm(EMPTY);
      setCreated(null);
      setCopied(false);
    }, 250);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Enter their name");
      return;
    }
    if (!form.email.trim() && !form.phone.trim()) {
      toast.error("Add an email or a phone number so they can be reached");
      return;
    }

    createInvite.mutate(
      {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        roleKey: form.roleKey,
        designation: form.designation.trim() || undefined,
        providesServices: form.providesServices,
        experienceYears: Number(form.experienceYears) || 0,
      },
      {
        onSuccess: (res) => setCreated(res.invite),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't create the invitation"),
      }
    );
  };

  const copyLink = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.invite_url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy - select the link and copy it manually");
    }
  };

  const whatsappHref = created
    ? `https://wa.me/${(created.phone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hi ${created.name}, join our team on Revoras: ${created.invite_url}`
      )}`
    : "";

  return (
    <Modal
      open={open}
      onOpenChange={(v) => (v ? onOpenChange(true) : close())}
      title={created ? "Invitation ready" : "Add a professional"}
      description={
        created
          ? "Share this link with them. It works once and expires in 14 days."
          : "They don't need a Revoras account yet — we'll send them a link to join your team."
      }
      footer={
        created ? (
          <Button onClick={close}>Done</Button>
        ) : (
          <>
            <Button intent="ghost" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={createInvite.isPending}>
              Send invitation
            </Button>
          </>
        )
      }
    >
      {created ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-surface-container-low p-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted">Invite link</div>
            <p className="mt-1 break-all text-sm text-on-surface">{created.invite_url}</p>
            <Button size="sm" intent="outline" className="mt-3" onClick={copyLink}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy link"}
            </Button>
          </div>

          {created.phone ? (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <Button size="sm" intent="outline" className="w-full">
                <MessageCircle size={16} /> Send on WhatsApp
              </Button>
            </a>
          ) : null}

          <p className="flex items-start gap-2 text-xs text-muted">
            <Mail size={14} className="mt-0.5 shrink-0" />
            {created.emailed
              ? `We also emailed it to ${created.email}.`
              : created.email
                ? "We couldn't email it right now — share the link above instead."
                : "No email address on this invite, so share the link above."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Ravi Kumar"
          />
          <Input
            label="Mobile number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="98765 43210"
          />
          <Input
            label="Email (optional)"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="ravi@example.com"
          />
          <p className="-mt-2 text-xs text-muted">
            Add at least one. With an email we can send the invite for you; otherwise share the link yourself.
          </p>
          <Select
            label="Role"
            value={form.roleKey}
            onValueChange={(v) => setForm((f) => ({ ...f, roleKey: v as "owner" | "staff" }))}
            options={[
              { value: "staff", label: "Staff — manages their own bookings" },
              { value: "owner", label: "Owner — full access to everything" },
            ]}
          />
          <Input
            label="Designation"
            value={form.designation}
            onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
            placeholder="e.g. Senior Stylist"
          />
          <Switch
            label="Customers can book them"
            description="Turn off for reception or management staff"
            checked={form.providesServices}
            onCheckedChange={(v) => setForm((f) => ({ ...f, providesServices: v }))}
          />
          <Input
            label="Years of experience"
            type="number"
            min={0}
            placeholder="0"
            // `|| ""` so a 0 shows as an empty field that can be cleared and
            // retyped — binding the raw number kept snapping it back to "0".
            value={form.experienceYears || ""}
            onChange={(e) => setForm((f) => ({ ...f, experienceYears: Number(e.target.value) }))}
          />
        </div>
      )}
    </Modal>
  );
}
