import { LayoutDashboard, ClipboardList, IdCard } from "lucide-react";

export interface StaffNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

export const STAFF_NAV_ITEMS: StaffNavItem[] = [
  { label: "My Day", href: "/staff", icon: LayoutDashboard },
  { label: "My Appointments", href: "/staff/appointments", icon: ClipboardList },
  { label: "My Profile", href: "/staff/my-profile", icon: IdCard },
];
