/**
 * Public half of the team-invite flow, used by /join.
 *
 * Deliberately not routed through `businessApi.request`: that helper attaches
 * the business token and, on a 401, clears business auth and redirects to the
 * business login. Someone opening an invite link is not a business user and may
 * not be signed in at all - those side effects would be actively wrong here.
 */
// Same fallback as api.ts - a localhost default would silently break in production.
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.revoras.tech/api";

export interface InvitePreview {
  name: string;
  designation: string | null;
  roleKey: string;
  businessName: string;
  businessLogoUrl: string | null;
  businessCity: string | null;
  /** true when this email already has a Revoras account - they sign in rather than set a password. */
  hasAccount: boolean;
}

const parse = async (res: Response) => {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Something went wrong");
  return body;
};

export const fetchInvitePreview = async (token: string): Promise<InvitePreview> => {
  const res = await fetch(`${API}/invites/${encodeURIComponent(token)}`);
  const body = await parse(res);
  return body.invite;
};

export const acceptInvite = async (token: string, password?: string) => {
  const res = await fetch(`${API}/invites/${encodeURIComponent(token)}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(password ? { password } : {}),
  });
  return parse(res);
};
