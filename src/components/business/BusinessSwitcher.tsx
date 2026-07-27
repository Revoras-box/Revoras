"use client";

import { ChevronsUpDown, Check, Building2 } from "lucide-react";
import { useBusinessAuth } from "@/lib/business/auth";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";

/** Only worth rendering as a switcher when the signed-in person has more than one membership. */
export function BusinessSwitcher() {
  const { memberships, activeMembership, switchBusiness } = useBusinessAuth();

  if (!activeMembership) return null;

  if (memberships.length === 1) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-on-surface">
        <Building2 size={ICON_SIZE.sm} className="text-muted shrink-0" />
        <span className="truncate">{activeMembership.businessName}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
          aria-label="Switch business"
        >
          <Building2 size={ICON_SIZE.sm} className="text-muted shrink-0" />
          <span className="flex-1 truncate text-left">{activeMembership.businessName}</span>
          <ChevronsUpDown size={ICON_SIZE.sm} className="text-muted shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-64">
        <DropdownMenuLabel>Your businesses</DropdownMenuLabel>
        {memberships.map((m) => (
          <DropdownMenuItem key={m.studioId} onSelect={() => switchBusiness(m.studioId)}>
            <span className="flex-1 truncate">{m.businessName}</span>
            {m.studioId === activeMembership.studioId ? <Check size={ICON_SIZE.sm} className="text-primary shrink-0" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
