import Navbar from "@/components/Navbar";
import SplashHero from "@/components/SplashHero";
import Footer from "@/components/Footer";
import { LandingCategories, FeaturedStudios, HowItWorks, BecomeHost } from "@/components/landing/LandingSections";

export default function SplashPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar
        brandText="Revoras"
        brandHref="/"
        navLinks={[
          { href: "/user", label: "Explore" },
          { href: "/user/search?hasOffers=true", label: "Offers" },
          { href: "/host/signup", label: "For Business" },
        ]}
      />
      <main className="flex-1">
        <SplashHero />
        <LandingCategories />
        <FeaturedStudios />
        <HowItWorks />
        <BecomeHost />
      </main>
      <Footer />
    </div>
  );
}
