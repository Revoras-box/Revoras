import type { Metadata } from "next";
import UserNavbar from "@/components/user/UserNavbar";
import UserFooter from "@/components/user/UserFooter";

export const metadata: Metadata = {
  title: {
    template: "%s | Revoras",
    default: "Dashboard | Revoras",
  },
  description: "Your personalized grooming experience with Revoras.",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <UserNavbar />
      <main>{children}</main>
      <UserFooter />
    </div>
  );
}
