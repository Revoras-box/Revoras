import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Master Barbers | Revoras",
  description: "Meet our master-level artisans who understand the nuances of classic and contemporary styling.",
  keywords: ["barbers", "master barbers", "grooming professionals", "luxury"],
};

export const revalidate = 86400; // ISR: Revalidate daily

export default function BarbersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 grainy-overlay z-50 pointer-events-none"></div>
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-primary-container/20">
              <span className="material-symbols-outlined text-primary text-sm">workspace_premium</span>
              <span className="text-primary text-xs font-label uppercase tracking-widest font-bold">The Digital Concierge</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[0.9]">
              Master <br />
              <span className="text-primary-container">Artisans</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-xl font-light leading-relaxed">
              Meet the architects of style. Our curated collective of master barbers combines century-old traditions with modern technical precision.
            </p>
          </div>
        </div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none hidden lg:block">
          <span className="material-symbols-outlined text-[350px]!">person</span>
        </div>
      </header>

      {/* Barber Profiles */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-on-surface-variant text-lg">
            Our master barber directory is coming soon.
          </p>
          <Link href="/user" className="inline-flex items-center space-x-2 text-primary font-headline font-bold uppercase tracking-widest">
            <span>Browse Studios Instead</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <div className="rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
              className="w-full h-112.5 object-cover"
            />
          </div>


          {/* Content */}
          <div className="space-y-6">

            <div className="text-xs tracking-widest text-primary-container uppercase">
              Unrivaled Experience
            </div>

            <h2 className="text-4xl font-bold">
              Craftsmanship Beyond the Ordinary.
            </h2>


            <div className="space-y-6">

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <h4>Vetted Excellence</h4>
                  <p className="text-muted text-sm">
                    Each artisan undergoes a rigorous 50-point technical assessment
                  </p>
                </div>
              </div>


              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center">
                  ✦
                </div>
                <div>
                  <h4>Bespoke Consultations</h4>
                  <p className="text-muted text-sm">
                    In-depth facial structure analysis and aesthetic alignment.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
