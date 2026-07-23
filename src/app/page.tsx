import Navbar from "@/components/Navbar";
import SplashHero from "@/components/SplashHero";
import Footer from "@/components/Footer";
import {
  TrustBand,
  LandingCategories,
  FeaturedStudios,
  HowItWorks,
  LandingFaq,
  BecomeHost,
} from "@/components/landing/LandingSections";

export default function SplashPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar brandText="Revoras" brandHref="/" />
      <main className="flex-1">
        <SplashHero />
        <TrustBand />
        <LandingCategories />
        <FeaturedStudios />
        <HowItWorks />
        <LandingFaq />
        <BecomeHost />
      </main>
      <Footer />
    </div>
  );
}
