import Navbar from "@/components/Navbar";
import SplashHero from "@/components/SplashHero";
import Footer from "@/components/Footer";

export default function SplashPage() {
  return (
    <div className="min-h-screen flex flex-col pt-10">
      <Navbar 
        brandText="Revoras" // Updated brand text as per design
        brandHref="/" // No link as per design
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
