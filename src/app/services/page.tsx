import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Premium Grooming Services | Revoras",
  description: "Explore our curated collection of artisanal barber services. From precision cuts to luxury treatments.",
  keywords: ["barber services", "grooming", "haircut", "luxury", "premium"],
};

export const revalidate = 3600; // ISR: Revalidate every hour

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 grainy-overlay z-50 pointer-events-none"></div>
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full text-primary">
              <span className="text-primary text-xs font-label uppercase tracking-widest font-bold">Elite Grooming Catalog</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[0.9]">
              Mastery in Every <br />
              <span className="text-primary">Subtle Detail.</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-xl font-light leading-relaxed">
              Select from our curated menu of artisanal services. Each session is a bespoke experience tailored to your unique structure and style.
            </p>
          </div>
        </div>
        {/* Decorative scissors */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none hidden lg:block">
          <span className="material-symbols-outlined text-[350px]!">content_cut</span>
        </div>
      </header>

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-muted text-lg">
            Our services catalog is coming soon. Browse individual studios to see what they offer today.
          </p>
          <Link href="/user" className="inline-flex items-center space-x-2 text-primary font-headline font-bold uppercase tracking-widest">
            <span>Browse Studios</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <h2 className="text-primary font-label uppercase tracking-[0.4em] text-xs font-bold">Ready for Your Transformation?</h2>
            <h3 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight max-w-3xl mx-auto">
              Join 4,000+ gentlemen who trust Revoras.
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login" className="premium-gradient text-on-primary px-12 py-5 rounded-full font-headline font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-105 transition-all inline-block">
              Book a Session
            </Link>
            <Link href="/barbers" className="flex items-center space-x-2 text-primary font-headline font-bold uppercase tracking-widest hover:translate-x-1 transition-transform">
              <span>Meet Our Barbers</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #c8a96e 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
      </section>

      <Footer />
    </div>
  );
}
