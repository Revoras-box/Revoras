"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { BadgeCheck, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { fetchInvitePreview, acceptInvite, type InvitePreview } from "@/lib/business/invites";

/**
 * Public landing page for a team invite link.
 *
 * Standalone (no business shell, no auth gate): the person opening this has no
 * account and no membership, so every wrapper on /business/* would bounce them.
 */
function JoinContent() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";

  const [invite, setInvite] = useState<InvitePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("This link is missing its invitation code.");
      setLoading(false);
      return;
    }
    fetchInvitePreview(token)
      .then(setInvite)
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't open this invitation"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async () => {
    // Only a brand-new account sets a password here; an existing one signs in.
    if (!invite?.hasAccount) {
      if (password.length < 8) {
        toast.error("Choose a password of at least 8 characters");
        return;
      }
      if (password !== confirm) {
        toast.error("Both passwords must match");
        return;
      }
    }

    setSubmitting(true);
    try {
      await acceptInvite(token, invite?.hasAccount ? undefined : password);
      toast.success(`You've joined ${invite?.businessName}`);
      // Deliberately to login, not the dashboard: accepting creates the account
      // but issues no session, so the dashboard would bounce them straight back.
      router.push("/login-barber");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't accept the invitation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-md p-6">
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="mx-auto w-full max-w-md p-6">
        <Card>
          <ErrorState
            title="This invitation isn't valid"
            description={error ?? "It may have expired, been cancelled, or already been used."}
          />
          <div className="flex justify-center">
            <Link href="/">
              <Button intent="outline" size="sm">
                Go to Revoras
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <Card className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 size={24} />
          </div>
          <div className="min-w-0">
            <h1 className="font-headline text-lg font-semibold text-on-surface">{invite.businessName}</h1>
            {invite.businessCity ? <p className="text-sm text-muted">{invite.businessCity}</p> : null}
          </div>
        </div>

        <div>
          <p className="text-sm text-on-surface">
            Hi {invite.name}, you&apos;ve been invited to join this team on Revoras
            {invite.designation ? ` as ${invite.designation}` : ""}.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge tone={invite.roleKey === "owner" ? "primary" : "neutral"}>{invite.roleKey}</Badge>
            <Badge tone="neutral">
              <BadgeCheck size={12} /> Invitation
            </Badge>
          </div>
        </div>

        {invite.hasAccount ? (
          <p className="rounded-xl bg-surface-container-low p-3 text-sm text-muted">
            You already have a Revoras account. Accept below, then sign in with your usual password.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <Input
              label="Create a password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
            <Input
              label="Confirm password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        )}

        <Button onClick={handleAccept} loading={submitting}>
          Join {invite.businessName}
        </Button>
      </Card>
    </div>
  );
}

export default function JoinPage() {
  return (
    // useSearchParams needs a Suspense boundary or the whole route opts out of
    // static rendering and Next fails the build.
    <main className="flex min-h-screen items-center justify-center bg-background">
      <Suspense fallback={<Skeleton className="h-72 w-full max-w-md rounded-2xl" />}>
        <JoinContent />
      </Suspense>
    </main>
  );
}
