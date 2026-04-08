import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SplashHero from "@/components/SplashHero";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Welcome | Revoras",
  description: "Revive Your Aura. The digital concierge for elite grooming experiences.",
};

export default function PreloginPage() {
  return (
    <div className="min-h-screen flex flex-col pt-10">
      <Navbar 
        brandText="Revoras"
        brandHref="/"
        navLinks={[
          { href: "/services", label: "Services" },
          { href: "/barbers", label: "Barbers" },
          { href: "/locations", label: "Locations" },
          { href: "/experience", label: "Experience" },
        ]}
      />
      <SplashHero />
      <Footer />
    </div>
  );
}
