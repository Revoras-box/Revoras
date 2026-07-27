"use client";

import { LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useBusinessAuth } from "@/lib/business/auth";
import { Avatar } from "@/components/ui/Avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";

export function UserMenu() {
  const { user, activeMembership, logout } = useBusinessAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40" aria-label="Account menu">
          <Avatar name={user.name} src={user.avatar_url} size="sm" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        {activeMembership ? (
          <div className="px-3 pb-2 text-xs text-muted">
            {activeMembership.designation || (activeMembership.role === "owner" ? "Owner" : "Staff")}
          </div>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/business/settings">
            <UserRound size={ICON_SIZE.sm} /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/business/settings">
            <Settings size={ICON_SIZE.sm} /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout} className="text-error">
          <LogOut size={ICON_SIZE.sm} /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
