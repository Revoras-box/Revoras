import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  UserCog,
  Scissors,
  CreditCard,
  BarChart3,
  Star,
  Bell,
  Settings,
  IdCard,
  BadgeCheck,
  Tag,
} from "lucide-react";
import { PERMISSIONS, type PermissionKey } from "@/lib/business/permissions";

export interface BusinessNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  /** Nav item is hidden entirely (not just disabled) when the active membership lacks this. */
  require?: PermissionKey;
}

export const BUSINESS_NAV_ITEMS: BusinessNavItem[] = [
  { label: "Dashboard", href: "/business", icon: LayoutDashboard },
  { label: "Calendar", href: "/business/calendar", icon: Calendar },
  { label: "Appointments", href: "/business/appointments", icon: ClipboardList },
  { label: "Customers", href: "/business/customers", icon: Users },
  { label: "Professionals", href: "/business/professionals", icon: UserCog },
  { label: "My Profile", href: "/business/my-profile", icon: IdCard },
  { label: "Services", href: "/business/services", icon: Scissors },
  { label: "Offers", href: "/business/offers", icon: Tag, require: PERMISSIONS.OFFERS_MANAGE },
  { label: "Payments", href: "/business/payments", icon: CreditCard, require: PERMISSIONS.PAYMENTS_VIEW },
  { label: "Analytics", href: "/business/analytics", icon: BarChart3, require: PERMISSIONS.ANALYTICS_VIEW },
  { label: "Reviews", href: "/business/reviews", icon: Star },
  { label: "Verification", href: "/business/verification", icon: BadgeCheck },
  { label: "Notifications", href: "/business/notifications", icon: Bell },
  { label: "Settings", href: "/business/settings", icon: Settings, require: PERMISSIONS.SETTINGS_MANAGE },
];
