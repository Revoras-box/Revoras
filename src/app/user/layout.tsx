import type { Metadata } from "next";
import CustomerNav from "@/components/user/CustomerNav";
import Footer from "@/components/Footer";
import { FavoritesProvider } from "@/lib/favorites";

export const metadata: Metadata = {
  title: {
    template: "%s | Revoras",
    default: "Discover | Revoras",
  },
  description: "Discover and book trusted salons, barbers, spas and beauty professionals near you.",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    // Browsing (discover, search, business/professional profiles) must not
    // require login. Only account-specific routes gate on auth, via their
    // own nested layout — see e.g. user/bookings/layout.tsx.
    <FavoritesProvider>
      <div className="min-h-screen bg-background text-foreground">
        <CustomerNav />
        <main className="pb-16 md:pb-0">{children}</main>
        <Footer />
      </div>
    </FavoritesProvider>
  );
}
