import { Lock } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ICON_SIZE } from "@/lib/design-tokens";

/**
 * The 6 real permission keys from db/seeds/02_permissions.js - the backend's
 * actual DB-driven RBAC, never a hardcoded role string. Every gated action
 * in the business dashboard checks one of these via `can()`, not `role`.
 */
export const PERMISSIONS = {
  BOOKINGS_MANAGE: "bookings.manage",
  SERVICES_MANAGE: "services.manage",
  TEAM_MANAGE: "team.manage",
  PAYMENTS_VIEW: "payments.view",
  SETTINGS_MANAGE: "settings.manage",
  ANALYTICS_VIEW: "analytics.view",
  OFFERS_MANAGE: "offers.manage", // Phase 2.4 (Offers & Promotions)
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const hasPermission = (permissions: string[], key: PermissionKey): boolean => permissions.includes(key);

/**
 * Renders a proper "No Access" state instead of broken UI when the active
 * membership lacks the required permission - the brief's "never hide pages
 * using role strings... show proper 403/No Access" rule, built from the
 * existing EmptyState primitive rather than new visual language.
 */
export function PermissionGate({
  permissions,
  require,
  children,
}: {
  permissions: string[];
  require: PermissionKey;
  children: React.ReactNode;
}) {
  if (hasPermission(permissions, require)) return <>{children}</>;

  return (
    <EmptyState
      icon={<Lock size={ICON_SIZE.lg} />}
      title="No access"
      description="Your role doesn't include permission to view this page. Ask a business owner to grant it if you need access."
    />
  );
}
