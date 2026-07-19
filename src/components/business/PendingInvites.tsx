"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useInvites, useResendInvite, useRevokeInvite } from "@/lib/business/hooks/useInvites";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/**
 * Pending invites sit above the team table rather than inside it: an invited
 * person is not a team member yet (they have no membership row at all), and
 * mixing them in would make "who can take bookings" ambiguous.
 *
 * Renders nothing when there are none, so an established business isn't paying
 * screen space for an empty section.
 */
export function PendingInvites({ studioId }: { studioId: string | undefined }) {
  const { data: invites, isLoading } = useInvites(studioId);
  const resend = useResendInvite(studioId);
  const revoke = useRevokeInvite(studioId);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (isLoading || !invites || invites.length === 0) return null;

  const handleResend = (id: string) =>
    resend.mutate(id, {
      onSuccess: async (res) => {
        // Resending rotates the token, so the old link stops working. Putting
        // the new one on the clipboard means the owner's next action (paste
        // into WhatsApp) works without hunting for it.
        try {
          await navigator.clipboard.writeText(res.invite.invite_url);
          toast.success(res.invite.emailed ? "Invite re-sent and link copied" : "New link copied");
        } catch {
          toast.success(res.invite.emailed ? "Invite re-sent" : "New link created");
        }
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't resend"),
    });

  const confirmTarget = invites.find((i) => i.id === confirmId);

  return (
    <>
      <Card className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-headline text-base font-semibold text-on-surface">Waiting to join</h2>
          <Badge tone="neutral">{invites.length}</Badge>
        </div>
        <p className="mb-4 text-sm text-muted">
          These people have been invited but haven&apos;t joined yet. They can&apos;t take bookings until they do.
        </p>

        <div className="flex flex-col gap-3">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-on-surface">{invite.name}</span>
                  <Badge tone={invite.role_key === "owner" ? "primary" : "neutral"}>{invite.role_key}</Badge>
                </div>
                <div className="mt-0.5 truncate text-xs text-muted">
                  {invite.email || invite.phone} · expires {fmtDate(invite.expires_at)}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  intent="outline"
                  loading={resend.isPending && resend.variables === invite.id}
                  onClick={() => handleResend(invite.id)}
                >
                  <RefreshCw size={14} /> Resend
                </Button>
                <Button size="sm" intent="ghost" onClick={() => setConfirmId(invite.id)} aria-label={`Cancel invite for ${invite.name}`}>
                  <X size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title={`Cancel invite for ${confirmTarget?.name ?? ""}?`}
        description="Their invite link will stop working immediately. You can invite them again later."
        confirmLabel="Cancel invite"
        destructive
        loading={revoke.isPending}
        onConfirm={() =>
          confirmId &&
          revoke.mutate(confirmId, {
            onSuccess: () => {
              toast.success("Invite cancelled");
              setConfirmId(null);
            },
            onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't cancel"),
          })
        }
      />
    </>
  );
}
