"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBarberAuth } from "@/lib/barber-auth";

const navItems = [
  { href: "/barbers/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/barbers/schedule", label: "Appointments", icon: "calendar_today" },
  { href: "/barbers/barbers", label: "Barbers", icon: "content_cut" },
  { href: "/barbers/services", label: "Services", icon: "dry_cleaning" },
  { href: "/barbers/walk-in", label: "Walk-In", icon: "person_add" },
  { href: "/barbers/payments", label: "Revenue", icon: "payments" },
  { href: "/barbers/analytics", label: "Analytics", icon: "insights" },
];

export default function BarberSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { barber, logout } = useBarberAuth();

  const isActive = (href: string) => {
    if (href === "/barbers/dashboard") return pathname === "/barbers/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] border-r border-[#4D463A]/15 py-8">
      <div className="px-8 mb-12">
        <h1 className="font-headline font-black text-[#E5C487] text-2xl tracking-tight">
          {typeof barber?.salon_name === "string" ? barber.salon_name : "Revoras"}
        </h1>
        <p className="uppercase tracking-widest text-[10px] text-[#4D463A] mt-1">
          Elite Management
        </p>
      </div>
      
      <div className="flex-1 flex flex-col space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center py-3 transition-all duration-300 ${
              isActive(item.href)
                ? "text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent"
                : "text-[#4D463A] pl-5 hover:text-[#E5C487] hover:bg-[#1C1B1B] hover:translate-x-1"
            }`}
          >
            <span className={`material-symbols-outlined mr-4 ${!isActive(item.href) && "opacity-70"}`}>
              {item.icon}
            </span>
            <span className="uppercase tracking-widest text-xs">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="px-8 mt-auto flex flex-col space-y-6">
        <button
          onClick={() => router.push("/barbers/walk-in")}
          className="bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold py-3 px-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200"
        >
          New Appointment
        </button>
        
        <div className="pt-6 border-t border-[#4D463A]/20 flex flex-col space-y-4">
          <Link
            href="/barbers/settings"
            className="flex items-center text-[#4D463A] hover:text-[#E5C487] transition-all"
          >
            <span className="material-symbols-outlined mr-3 text-sm">settings</span>
            <span className="uppercase tracking-widest text-[10px]">Settings</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center text-[#4D463A] hover:text-red-500 transition-all"
          >
            <span className="material-symbols-outlined mr-3 text-sm">logout</span>
            <span className="uppercase tracking-widest text-[10px]">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
