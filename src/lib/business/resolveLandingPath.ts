import type { BusinessMembership } from "./api";

/** Where a signed-in business account belongs, based on the membership in view. */
export function resolveLandingPath(
  memberships: BusinessMembership[],
  activeMembership: BusinessMembership | null
): string {
  const membership = activeMembership ?? memberships[0] ?? null;
  return membership?.role === "owner" ? "/business" : "/staff";
}

/** Where to send someone to sign back in, based on the role they just signed out of. */
export function resolveLoginPath(role: BusinessMembership["role"] | undefined): string {
  return role === "owner" ? "/login-barber" : "/login-staff";
}
