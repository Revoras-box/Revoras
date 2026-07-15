import type { Metadata } from "next";
import AuthGate from "@/components/user/AuthGate";
import CustomerNav from "@/components/user/CustomerNav";
import UserFooter from "@/components/user/UserFooter";
import { FavoritesProvider } from "@/lib/favorites";

export const metadata: Metadata = {
  title: {
    template: "%s | Revoras",
    default: "Discover | Revoras",
  },
  description: "Your personalized grooming experience with Revoras.",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      {/* Phase 2.3: one favorites fetch for the whole customer area, shared by
          every card, instead of one request per rail. */}
      <FavoritesProvider>
        <div className="min-h-screen bg-background text-foreground">
          <CustomerNav />
          <main className="pb-16 md:pb-0">{children}</main>
          <UserFooter />
        </div>
      </FavoritesProvider>
    </AuthGate>
  );
}
